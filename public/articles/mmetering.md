{
      "title" : "Smart metering for community houses",
      "date"  : "10-04-2018",
      "slug"  : "mmetering",
      "author": "Christoph Sonntag",
      "tags": ["django", "modbus", "redis", "celery"],
      "preview_text": "MMetering is an administration software for recording and evaluating electricity meter data in both private and community buildings.",
      "image": "mmetering_feature.png"
}

Originally built for a housing cooperative that wanted to automate its members' electricity billing, while 
encouraging them to strategically use their photovoltaic (PV) system at the same time. 

<img align="right" style="padding: 2em;" width="500" src="/articles/mmetering/mmetering-browser-image.png">

They have already had separate meter installed for each apartment, connected via a bus where they could talk to 
each other (or a server) using the [MODBUS](https://en.wikipedia.org/wiki/Modbus) protocol. 
In addition to that, the cooperative also planned on installing two chargers for electrical vehicles,
where residents could authenticate themselves so that the costs could be automatically included in the final bill. 

Upon request of the client, the whole system should be self-contained and only accessible within its own network. 

## Architecture
The backbone of this application is a dockerized [Django](https://www.djangoproject.com/) project, that 
uses [Celery](https://docs.celeryq.dev/en/stable/index.html) as a task queue and [Redis](https://redis.io/) as a way 
of persisting the communication for communicating with the meter. 
They are queried in a 15-minute interval and usage values are written into a PostgreSQL database. 

NFT cards were handed out to the residents with which they could identify themselves at the charging stations. 
They were able to see their current consumption and what the PV system currently produces, so that they 
could coordinate the use of energy-intensive devices to what the PV was delivering. 




