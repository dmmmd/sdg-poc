# SDG Alignment Dashboard
This is a PoC for the application to visually summarize the alignment of a given company to the UN Sustainable Development Goals (SDGs).

In the UI I take creative liberties to demonstrate the concept. Impact values are based on the revenue as required, but of course there should be more complex logic in the real world. I don't even have a flow of time, there are no years with different revenue, each company just has one number.

### The data
- Companies are taken from S&P 500 list
- Products/services are from Google product taxonomy
- SDGs are from the official UN list
- Company-product relationships are **randomly generated** during the seed
- The alignment data is **randomly generated** during the seed

## TLDR How to use
1. `git clone git@github.com:dmmmd/uprght.git savonsuo-upright && cd savonsuo-upright && make up migrate seed`
2. Open the UI at http://127.0.0.1:3001/
3. `make down` to stop the containers, keeping the data
4. `make up` to start again
5. `make clean` to remove everything

Ports are configured in [docker-compose.dev.yml](dev-env/docker-compose.dev.yml), in case you get some conflicts.

### Extras
- GraphQL API playground is at http://127.0.0.1:4001/
- Postgres database is available at `localhost:25432`, user `upright`, password `upright`, database `upright`. Accessible outside the container just for you.
- If you want to read the code with IDE and it not to be all red, run `npm install` from host machine under `/api` and `/ui`

## AI use
My expertise lies in the backend and this is where I designed and implemented everything myself, using WebStorm with only the Copilot autocomplete.

I have zero frontend experience, so I've used it as an opportunity to prototype entirely with AI. I have used the Cursor and didn't write or even edited a single line of code, as an experiment to see how far I could get. It took some iterating, and "we" have built a demoable UI. As I look at the code quality of it -- I am not satisfied. For production use and my own education, I must go through everything there, understand and fix all the issues, make it my own. I am actually looking forward to mastering the frontend side of things. However, I think it's good now for a demo purpose. 

## Limitations
This is as a PoC, so I have cut a lot of corners to focus on the core functionality. Some of the limitations are:
- No tests -- this is the most painful for me, I put it as a first priority as a next step
- No authentication or authorization
- No input validation or sanitization
- No real error handling
- Very naive caching in my data loaders
- This is not a deployable production setup, but a demoable development environment with live reloads etc

## Architecture
Everything is containerized using Docker and orchestrated with Docker Compose. TypeScript throughout.

### Backend
- GraphQL API using Apollo Server and Node.js
- PostgreSQL database, managed with Objection

I choose GraphQL for its flexibility: the frontend has a lot of freedom to how it wants to design the UX.

#### Data model
Most tables are self-explanatory, but I will point out a few things.

1. I am using a materialized view for the [product impact lookups](api/src/storage/migrations/20250906015525_create_product_impact_view.ts). It's a solution for the case when a product is aligned to a goal indirectly, via one of its parents. I think with your data size it might even pass as a production solution. The product data is relatively static, I think, so we might get away with refreshing the view on schedule or after the change. If this wouldn't perform well with real data, then I would instead populate a similar table based on events: every change in the raw product table would publish an event and a separate worker(s) would update the lookup table.
2. I am also using a materialized view for the [goal impact lookups](api/src/storage/migrations/20250906101252_create_goal_impact_view.ts). This is a cheap way to look at the data from a goal perspective. Contributing companies, or sectors, for instance. This is definitely a PoC **cheat**. Why? First of all, I designed the storages to be [separate](api/src/storage/storageFeatures.ts) for the companies, products and goals. They are currently using the same database, but the code is not aware of it. In production it might be separate DB servers, or even separate services. Naturally, we wouldn't be able to join the tables between those storages. Also the size of this table might be too big to effectively handle the real data. Even though I've seen Posgres handle quite a lot, when it's mostly reads. In any case, for it to be scalable, I cannot depend on the joins and refreshing the views. My real approach would be similar in that for a certain kind of lookups I create a denormalized copy of the data, possibly sharded in some cases. It lets me read it very efficiently. Depending on use cases, I might have multiple structures. The downside of it is maintenance, but I am used to it and it definitely can be done. I think it's more effective than trying to have one structure serve all purposes. I like to keep my queries cheap and simple.  
3. I am not using any foreign keys, on purpose. In short, it's to be able to keep the storages separate; lower risk of mass deletion. As with everything, I would gladly discuss it in the interview.

### UI
- React
- Apollo Client, Codegen
