# POC: Prisma Upsert introduces ID gaps

This POC wants to demonstrate that `Prisma.upsert` reserves the next sequence ID (see the function [nextval](https://www.postgresql.org/docs/16/functions-sequence.html) in Postgres for further information) before checking whether the entry already exists (which means the entry needs to be updated) or not (needs to be created).

The code does the following:

- Create the first entry (`User`) in the table, which would have ID = 1.
- Randomly create or update Users within a loop with 100 iterations.

The output of this apps execution looks like this

```bash
❯ npm start

> prisma-upsert@1.0.0 start
> ts-node main.ts

User updated: ID=1 email=764758c4-163b-44a9-a2b9-614256e048c8 name=9f1d8ace-154a-47ba-87a3-0f0d0f6bfde3
User created: ID=3 email=7d192dff-9752-4bac-b197-3d34b2ee99cb name=5401a541-1405-43ed-9d20-354338b8345f
User updated: ID=1 email=764758c4-163b-44a9-a2b9-614256e048c8 name=89e8008f-a80c-4470-8681-6783c91d9cbc
User created: ID=5 email=7d85ba13-ec58-48ed-a522-2defa2663642 name=8dd5dba7-f314-4cfe-bb19-b05546aaaf7d
User created: ID=6 email=c3330063-d089-4d3c-b972-a015bb5a98cc name=d220675d-8234-467c-b59c-29d2fe128343
User created: ID=7 email=69c913d2-9d58-4ce0-84b7-a7de0737ce16 name=73f49983-f3fc-4fb2-92b8-f14619f764d7
User updated: ID=1 email=764758c4-163b-44a9-a2b9-614256e048c8 name=2fd1cef0-7cbc-44d2-ae7f-fe39ee2c74bb
User updated: ID=1 email=764758c4-163b-44a9-a2b9-614256e048c8 name=7d553e93-6063-48b9-9b9c-501548552aa9
User created: ID=10 email=c124cda1-f3e1-427c-b28f-50988129a025 name=0edf71b3-cdee-48da-80d7-cc4373eb0056
User created: ID=11 email=edac6ab8-6b2f-4248-96ef-11c23dd933bf name=efd76f76-881f-4194-8e65-bec7fd7e2052
User updated: ID=1 email=764758c4-163b-44a9-a2b9-614256e048c8 name=3495c128-726b-411c-9bcb-62b2a6155cc2
User updated: ID=1 email=764758c4-163b-44a9-a2b9-614256e048c8 name=3aee43a8-7885-4f49-bd83-517e3a706023
User created: ID=14 email=d7d742a9-6b10-4c03-b1e3-0285f212a8af name=9176f77b-34c5-4c66-8257-2e11f97afe6e
User created: ID=15 email=b0152261-520b-49d7-9d65-37a3ac59ec72 name=bc81e50f-884f-4a78-99c5-d82b081a569e
[...]
```

As you may notice the ID is sequential until an entry is not created but updated. In that case, the next sequence number is fetched but not used.

## Quickstart

```bash
npm install
npm run db:init
npm start
```

Notice that the ID of the newest entry is 100 even when around 50% of the operations consist in updating existing users.
