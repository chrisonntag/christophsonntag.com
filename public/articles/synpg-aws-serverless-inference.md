{
      "title" : "Preparing a custom trained PyTorch Model for Serverless Inference in AWS SageMaker",
      "date"  : "10-04-2024",
      "slug"  : "synpg-aws-serverless-inference",
      "author": "Christoph Sonntag",
      "tags": ["cloud", "aws", "docker", "sagemaker", "serverless", "pytorch"],
      "preview_text": "This notebook serves as an documentary entry-point for deploying a custom-trained PyTorch model on AWS SageMaker on a Serverless Inference Endpoint."
}


"Amazon SageMaker Serverless Inference is a purpose-built inference option that enables you to deploy and scale ML models without configuring or managing any of the underlying infrastructure." ([Source](https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)).

In order to use this, we need to prepare two assets:

1. A Docker container, which includes all necessary dependencies like libraries and other 3rd party Python packages, and
2. a compressed tar file, which encapsules the model artifacts (weights, vocabulary, …) and an inference script, which has to offer a set of certain functions.

## Implementing the inference script

SageMaker expects the inference script to offer the following functions. Check out a dummy implementation below:

```
def model_fn(model_dir):
    """
    This function is the first to get executed upon a prediction request,
    it loads the model from the disk and returns the model object which will be used later for inference.
    """
    dictionary = load_dictionary(os.path.join(model_dir, 'dictionary.pkl'))
    synpg_model = SynPG(len(dictionary), 300, word_dropout=0.4)
    pg_model = SynPG(len(dictionary), 300, word_dropout=0.4)

    return synpg_model, pg_model, bpe, dictionary


def input_fn(request_body, request_content_type):
    """
    The request_body is passed in by SageMaker and the content type is passed in
    via an HTTP header by the client (or caller). This function then processes the
    input data, and extracts three fields from the json body called "sent", "synt"
    and "tmpl" and returns all three.

    Example JSON input:
    {
        "sent": "The quick brown fox jumps over the lazy dog",
        "synt": "(ROOT (S (NP (DT The) (JJ quick) (JJ brown) (NN fox)) (VP (VBZ jumps) (PP (IN over) (NP (DT the) (JJ lazy) (NN dog)))))",
        "tmpl": "(ROOT (S (S ) (, ) (CC ) (S ) (. )))"
    }
    """
    # Extract the sent, synt and tmpl from the request
    sent = json.loads(request_body)["sent"]
    synt = json.loads(request_body)["synt"]
    tmpl = json.loads(request_body)["tmpl"]


    return sent, synt, tmpl


def predict_fn(input_data, model):
    """
    This function takes in the input data and the model returned by the model_fn
    It gets executed after the model_fn and its output is returned as the API response.
    """

    synpg_model, pg_model, bpe, dictionary = model

    sent, synt, tmpl = input_data
    tmpls = template2tensor([tmpl], args['max_tmpl_len'], dictionary)

    with torch.no_grad():
        # Predict using the model.    
        
    return output_idxs, dictionary


def output_fn(prediction, accept):
    """
    Post-processing function for model predictions. It gets executed after the predict_fn
    and returns the prediction as json.
    """
    output_idxs, dictionary = prediction

    return json.dumps(output_idxs), accept
```

## Creating the model tar file

From PyTorch>=1.2.0 on, SageMaker requires the tar file to have a certain structure:
```
./
  code/
    inference.py
    requirements.txt
  model.pth
  vocab.txt
  ...
```

We accomplish this with
```
tar -czvf artifacts/model.tar.gz code/ -C model/ .
```

This can now be uploaded to your AWS S3 Bucket.

## Preparing the Dockerfile

The Dockerfile in this case uses a pre-built container as a basis, which already includes the specific PyTorch version we need for this project.

```
FROM 763104351884.dkr.ecr.eu-central-1.amazonaws.com/pytorch-inference:1.2.0-gpu-py36-cu100-ubuntu16.04

# Set environment variables
# ensures that Python outputs everything that's printed directly to the terminal (so logs can be seen in real-time)
ENV PYTHONUNBUFFERED=TRUE
# ensures Python doesn't try to write .pyc files to disk (useful for improving performance in some scenarios)
ENV PYTHONDONTWRITEBYTECODE=TRUE
# Update PATH environment variable to include /opt/program directory
ENV PATH="/opt/ml/code:${PATH}"

WORKDIR /opt/ml/code

COPY ./requirements.txt /opt/ml/code/requirements.txt

COPY ./app.py /opt/ml/code/app.py
COPY ./code/ /opt/ml/code/
COPY ./synpg /opt/ml/code/synpg/

RUN ls -laR /opt/ml/code/*

ENV SM_MODEL_DIR /opt/ml/model
ENV SAGEMAKER_SUBMIT_DIRECTORY /opt/ml/code
ENV SAGEMAKER_PROGRAM inference.py

RUN pip install --no-cache-dir "git+https://github.com/chrisonntag/synpg.git"
RUN pip install --no-cache-dir -r requirements.txt
RUN pip freeze

#EXPOSE 8080
#ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:8080", "app:app", "--timeout", "180"]

```

## Pushing the Docker container to the Registry

Follow the steps to create the container and push it to a new registry in AWS, which we can use later on for model deployment.

Add your AWS region and account to the .ENV file in the root directory and export the variables with the following command.
```
export $(cat .env | xargs)
```

```
# Authenticate Docker to an Amazon ECR registry
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $DOCKER_REG.dkr.ecr.$REGION.amazonaws.com

# Loging to your private Amazon ECR registry
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT.dkr.ecr.$REGION.amazonaws.com
```

Don't forget to create an access key for the AWC CLI.

Now build the Docker image and push it to the Amazon ECR registry.
```
docker build -t synpg .
```

```
# Create the AWS ECR repository
aws ecr create-repository --repository-name synpg

# Tag the image
docker tag synpg:latest $ACCOUNT.dkr.ecr.$REGION.amazonaws.com/synpg:latest

# Push the tagged image to the AWS ECR repository
docker push $ACCOUNT.dkr.ecr.$REGION.amazonaws.com/synpg:latest
```



## Deploying the model to AWS

Now that we have uploaded the model artifacts and the inference code to an S3 bucket and the Docker image pushed to our registry, we can either create an endpoint by ourselves and use ```boto3``` to create a client and invoke the endpoint:

```
runtime = boto3.client("sagemaker-runtime", region_name="eu-central-1")

response = runtime.invoke_endpoint(
    EndpointName="scpn-endpoint",
    ContentType="application/json",
    Body=payload
)
```

or we deploy the model and the endpoint right out of this notebook using the SageMaker Python package.


```python
!pip install boto3 awscli sagemaker datasets
```


```python
!aws configure
```


```python
import boto3
import json
import numpy as np
from sagemaker.pytorch import PyTorchModel
from sagemaker.base_serializers import JSONSerializer
from sagemaker.base_deserializers import JSONDeserializer

S3_URI = "s3://<path to model.tar.gz>"
IMAGE_URI = "<path to>synpg:latest"

# As our defined content_type will be application/json, we need to sent it as
# that as well. So no json.dumps() here, because this would sent it as a string,
# raising a ValueError in the input_fn of our inference script.
payload = {
    "sent": "we will have a picnic if it is a sunny day tomorrow.",
    "synt": "(ROOT (S (NP (PRP we)) (VP (MD will) (VP (VB have) (NP (DT a) (NN picnic)) (SBAR (IN if) (S (NP (PRP it)) (VP (VBZ is) (NP (DT a) (JJ sunny) (NN day)) (NP (NN tomorrow))))))) (. .)))",
    "tmpl": "(ROOT (S (S ) (, ) (CC ) (S ) (. )))"
    }
```


```python
synpg_model = PyTorchModel(
    model_data=S3_URI,
    image_uri=IMAGE_URI,
    role="SCPNS3SageMakerRole",
    entry_point='inference.py'
    )
```


```python
synpg_predictor = synpg_model.deploy(
    instance_type='ml.g4dn.xlarge',
    initial_instance_count=1,
    serializer=JSONSerializer(),
    deserializer=JSONDeserializer(),
    accept='application/json',
    content_type='application/json'
    )
```

### Invoking the endpoint


```python
response = synpg_predictor.predict(payload, initial_args={'ContentType': 'application/json'})
response
```




    'it is a sunny day on a day , but we will have a tomorrowland .'



### Paraphrasing SST2


```python
from datasets import load_dataset

sst2 = load_dataset("christophsonntag/sst2-constituency", split="train", streaming=True).take(6)
```


```python
syntax_template = "(ROOT (S (S ) (, ) (CC ) (S ) (. )))"

print(f"Pairs of sentences and its paraphrased version using the following template: {syntax_template}\n")
for elem in sst2:
  payload = {
      "sent": elem["sentence"],
      "synt": elem["constituency_tree"],
      "tmpl": syntax_template
  }

  paraphrased_sentence = synpg_predictor.predict(payload, initial_args={'ContentType': 'application/json'})
  print(f"{elem['sentence']}\n{paraphrased_sentence}\n\n")
```

    Pairs of sentences and its paraphrased version using the following template: (ROOT (S (S ) (, ) (CC ) (S ) (. )))
    
    hide new secretions from the parental units 
    hide the parental secretions , and you learn from new units .
    
    
    contains no wit , only labored gags 
    no wit contains been labored , but gags labored only .
    
    
    that loves its characters and communicates something rather beautiful about human nature 
    the nature of that book is beautiful , and its something loves rather human characters .
    
    
    remains utterly satisfied to remain the same throughout 
    the situation remains dissatisfied , but it is same to remain utterly throughout history .
    
    
    on the worst revenge-of-the-nerds clichés the filmmakers could dredge up 
    the filmmakers could dredge up the filmmakers , but revengeing the folks on the worst lurch?s of revengee-toggle .
    
    
    that 's far too tragic to merit such superficial treatment 
    merit is superficial , but that tragic treatment seems to be far such too .
    
    


## Cleanup

Make sure to delete the endpoint, in order to cut costs.


```python
synpg_predictor.delete_endpoint()
```
