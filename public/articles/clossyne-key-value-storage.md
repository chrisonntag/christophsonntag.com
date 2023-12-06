{
      "title" : "Case Study: Distributed Key-Value Storage",
      "date"  : "31-01-2023",
      "slug"  : "clossyne-key-value-storage",
      "author": "Christoph Sonntag",
      "tags": ["scala", "akka", "docker", "actor"],
      "preview_text": "Short for Cloud Storage System, Clossyne is a distributed key-value storage based on binary search-tress, accessed by a dictionary-based data access API.",
      "image": "clossyne_feature.png"
}

[Clossyne](https://github.com/chrisonntag/clossyne), is a distributed CLOud Storage System based on binary search trees. 
The name is derived from the Greek goddess of memory, MnemosYNE, and represents the idea of efficient recall and storage. 
The system can be easily accessed through a dictionary-based data access API and is implemented in Scala. 
The goal of this project was to provide the sketch of a scalable and efficient way to store and recall large 
amounts of data in a distributed environment.

## Design Decisions
In the beginning, I had to make a choice about what language and framework to use for this project. 
I thought about several options such as Python, Docker and Kafka in the beginning but I fell for Scala and Akka in the end 
because I was intrigued by Scala's functional style and because it seemed that the Actor model, implemented in Akka 
would be a good choice for a concurrent, distributed, and scalable system. 
After some research, I found a very basic [binary tree implementation](http://alexminnaar.com/2015/01/05/building_a_distributed_binary_search_tree_with_akka.html), 
that also uses Akka which guided me in the beginning of the project. 

Akka offers some very useful features. 

- It provides [multi-threaded behavior](https://doc.akka.io/docs/akka/current/typed/guide/introduction.html) without low-level concurrency constructs like atomics or locks. This makes it much easier to write correct concurrent, parallel and distributed code without having to worry about memory visibility issues. 
- Akka provides transparent remote communication between systems and their components, which relieved me from writing and maintaining difficult networking code. 
- Akka has a clustered, high-availability architecture that is elastic and can scale in or out on demand. This enabled me to deliver a truly reactive system that can handle any amount of data and traffic, making it ideal for this project. 
- The actor model provides some level of abstraction that makes debugging way easier.

## The Actor Model
The actor model is a concurrency model used in distributed architectures where actors represent entities that can send and receive messages. 
It is often used where it’s necessary to handle large amounts of parallelism, such as in multi-threaded systems. 
In the actor model, each actor is an isolated and independent unit of computation and communication, with its own state 
and behavior. Actors communicate with one another by exchanging messages, and they only have access to their own state. 

## Binary Search Tree
Binary search trees (BST) are a data structure which organizes data in a hierarchical way. Each node of the tree has 
at most two children, thus the term binary. 
Each node in a BST holds a value where the value of the left child is strictly less than the value of the node, 
while the value of the right child is always greater than the value of the node. 
This ordering property allows for efficient searching, insertion, and deletion of data.

While insertion and searching can be done intuitively, deletion needs to ensure that the ordering property of the tree is maintained. 
If the node to be deleted is a leaf node (i.e. it has no children), the node can simply be removed from the 
tree without affecting the ordering property.
However, if the node to be deleted has one child, the child node can take the place of the deleted node without 
affecting the ordering property. The child node is simply connected to the parent of the deleted node in place of the deleted node. 

The most complex case occurs if the node to be deleted has two children. In this case, 
the in-order predecessor or the in-order successor of the node (whichever is available) can be used to 
take the place of the deleted node. The in-order predecessor is the largest value in the left subtree of the 
node and the in-order successor is the smallest value in the right subtree of the node. 
This replacement maintains the ordering property of the tree. 
After the replacement, the node that is used as a replacement, is deleted as in one of the first two cases.

## Implementation
I created the ```ClossyneServer``` actor as the main component responsible for managing client connections and handling 
communication between the clients and the ```BinaryTree``` actor. 
This actor listens on port 4297 and accepts new TCP connections from clients, assigning a ```MessageHandler``` to 
each new connection. The ```ClossyneServer``` also creates the ```BinaryTree``` actor, which serves as the root node of the binary search tree. 

The ```MessageHandler``` plays an important role in the communication between the clients and the binary tree structure. 
Whenever a client sends commands, the ```MessageHandler``` is responsible for parsing the commands and forwarding the events 
to the ```BinaryTree```. The ```MessageHandler``` also acts as a mediator between the tree structure and the client, 
forwarding response events back to the TCP client. 

Most of the events such as ```SET``` and ```GET``` are straightforward and are simply forwarded to the ```BinaryTree```. 
However, if the ```BinaryTree``` receives a ```DELETE``` command, it switches to a new context in which it temporarily enqueues 
new incoming events until the tree has finished with the deletion operation. This ensures that the tree structure 
remains intact even during a deletion operation. 

```scala
class BinaryTree extends Actor with ActorLogging {
    ...
     
    def receive: Receive = {
        case op: Operation =>
            op match {
                case Delete(requester, key) =>
                    log.debug("Delete received: Changing context now")
                    context.become(nodeDeletion)
                    root ! DeleteForward(requester, self, key)
                case _ => root ! op
            }
        case opReply: OperationForwardFinished => opReply.destination ! OperationFinished(opReply.succeeded, None)
    }
    
    def nodeDeletion: Receive = {
        case op: Operation =>
            log.debug(s"Enqueuing operation ${op}")
            pendingOperations.enqueue(op)
        case opReply: OperationForwardFinished =>
            log.debug(s"Delete operation finished. Change context and send enqueued operations.")
            context.become(receive)

            opReply.destination ! OperationFinished(opReply.succeeded, None)
            pendingOperations.map(self ! _)
            pendingOperations = Queue.empty
    }
}
```
<figcaption>

Excerpt from the <a href="https://github.com/chrisonntag/clossyne/blob/main/clossyne/src/main/scala/searchtree/BinaryTree.scala">BinaryTree</a> showing how the context becomes nodeDeletion upon receiving a Delete Operation. 

</figcaption>

The bulk of the logic in Clossyne is implemented by the single ```TreeNode``` actors, who are responsible for recursively 
forwarding events to their children, restructuring themselves, and deleting nodes. 
Each ```TreeNode``` actor holds its key-value pair and its position in the binary search tree. Finally, response events 
such as ```OperationReply``` are sent back to the respective ```MessageHandler```, which then sends results and status messages 
back to the TCP client. 
This design ensures that the clients receive immediate feedback on their operations, allowing for a seamless and efficient data access experience. 

```scala
...

class BinaryTreeNode(val k: String, val v: String, parentActor: ActorRef) extends Actor with ActorLogging {
    import searchtree.BinaryTreeNode._

    var subtrees: Map[Position, ActorRef] = Map[Position, ActorRef]()
    var parent: ActorRef = parentActor

    val key: String = k
    val value: String = v

   ... 

    def receive: Receive = {
        case Set(requester, key, value) =>
            log.debug(s"Set ${key}:${value}")
            if (key != this.key) {
                val child = getChildFor(key)
                subtrees.get(child) match {
                    // Forward insert to child node if it exists, create one otherwise.
                    case Some(actor) => actor ! Set(requester, key, value)
                    case None =>
                        subtrees += (child -> context.actorOf(BinaryTreeNode.props(key, value, self), s"${key}"))
                        requester ! OperationFinished(succeeded = true, None)
                }
            } else {
                requester ! OperationFinished(succeeded = true, None)
            }
        ...
    }
    ...
}
```
<figcaption>

Excerpt from the <a href="https://github.com/chrisonntag/clossyne/blob/main/clossyne/src/main/scala/searchtree/BinaryTreeNode.scala">BinaryTreeNode</a> showing handling of the Set Operation in a TreeNode.

</figcaption>