{
      "title" : "Smart Metering For Community Houses",
      "date"  : "10-04-2018",
      "slug"  : "mmetering",
      "author": "Christoph Sonntag",
      "tags": ["django", "modbus", "redis", "celery"],
      "preview_text": "MMetering is an administration software for recording and evaluating electricity meter data in both private and community buildings.",
      "image": "mmetering_feature.png"
}

Originally designed to streamline electricity-billing for a housing cooperative, this 
projects' goal was to automate billing processes while encouraging the strategic use of the photovoltaic (PV) system at the same time. 
Following the plans for the [EU Directive 2019/944](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2019.158.01.0125.01.ENG&toc=OJ:L:2019:158:TOC), 
the general idea was to raise energy awareness and improve the use of renewable energy sources. 
We achieved this by providing [appliance-level feedback](https://www.aceee.org/sites/default/files/publications/researchreports/e105.pdf) on residents' individual 
energy usage through a user-friendly web interface. 

Residents were able to have real-time insights into their current energy consumption and the PV system's output, enabling them to align energy-intensive activities 
with the PV system's availability. 
This type of direct feedback, visualizing the energy usage in nearly real-time (every 15 minutes), has proven effective in promoting 
more careful energy consumption, resulting in an [estimated 12%](https://www.aceee.org/sites/default/files/publications/researchreports/e105.pdf) reduction 
in electricity costs for the cooperatives' members. 

Beyond automated billing, our solution extended to the support of electrical vehicle chargers. 
Residents could authenticate themselves with NFT cards, and the associated costs were automatically included in their final bills.

<img align="right" style="padding: 2em;" width="500" src="/articles/mmetering/mmetering-browser-image.png">

They have already had separate meters installed for each apartment, connected via a bus where they could talk to 
each other (or a server) using the [MODBUS](https://en.wikipedia.org/wiki/Modbus) protocol. 

Upon request of the client, the entire system was designed to be self-contained, accessible exclusively within its own network.

## Architecture
The backbone of this application is a dockerized [Django](https://www.djangoproject.com/) project, that 
uses [Celery](https://docs.celeryq.dev/en/stable/index.html) as a task queue and [Redis](https://redis.io/) as a way 
of persisting the communication with the meters. 
They are queried in a 15-minute interval and usage values are written into a PostgreSQL database. 



