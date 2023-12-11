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
Following the [EU Directive 2019/944](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2019.158.01.0125.01.ENG&toc=OJ:L:2019:158:TOC), 
the general idea was to raise energy awareness and encourage the use of renewable energies by giving [appliance-level feedback](https://www.aceee.org/sites/default/files/publications/researchreports/e105.pdf) on their specific energy usage. 
Therefore, residents were able to see their current consumption and what the PV system currently produces in a web interface, so that they 
could coordinate the use of energy-intensive devices to what the PV was delivering. 

This type of direct feedback, which visualizes the energy usage of each home in nearly real-time (every 15 minutes), is expected to result 
in more careful energy consumption and thus to electricity savings of [approximately 12%](https://www.aceee.org/sites/default/files/publications/researchreports/e105.pdf).

In addition to that, the cooperative also offered two chargers for electrical vehicles,
where residents could authenticate themselves so that the costs could be automatically included in the final bill. 
NFT cards were handed out to the residents with which they could identify themselves at the charging stations. 

<img align="right" style="padding: 2em;" width="500" src="/articles/mmetering/mmetering-browser-image.png">

They have already had separate meters installed for each apartment, connected via a bus where they could talk to 
each other (or a server) using the [MODBUS](https://en.wikipedia.org/wiki/Modbus) protocol. 

Upon request of the client, the whole system should be self-contained and only accessible within its own network. 

## Architecture
The backbone of this application is a dockerized [Django](https://www.djangoproject.com/) project, that 
uses [Celery](https://docs.celeryq.dev/en/stable/index.html) as a task queue and [Redis](https://redis.io/) as a way 
of persisting the communication with the meters. 
They are queried in a 15-minute interval and usage values are written into a PostgreSQL database. 



When the EU introduced smart meters, the idea was to give consumers more information about their power consumption, thus raising energy awareness. Tailored appliance-level feedback is expected to lead to more careful use of energy and thus to savings of around 12%.




