# Deployment Procedure

## IMPORTANT
DO NOT RUN `npm run dev:clean` on production.  
This will delete your database files.
Whenever a new collection is added, you may need to temporarily disable authentication
OR manually setup the user by copying the commands in _config/init_db_scripts_ and running them on MongoDB CLI

## One-time setup
1) Pull repo
2) Install docker (https://docs.docker.com/)
4) Update the _docker-compose.yml_ file
    1) Change the command for the server to `npm run start:prod`
    2) Map the network ports in case they don't match   
       (only the port on the left-side of the ':' needs to be changed)
5) `npm run docker`
6) Wait for the entire setup to be up and running
    1) Make sure the collections connect properly.  
    2) Send a request to the server that also accesses the database  
       This should pull out any obvious network/connection errors
7) `CTRL+C` and wait for the docker containers to spin down

## Starting the server
1) Make sure you've done everything from the one-time setup already
2) `npm run docker`
3) Verify everything works