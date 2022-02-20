# bltzrTask

Please follow the below steps to run the application.
- Install redis-server, mongoDB, nodejs on your system. 
- Run npm install
- Run mongo and redis on your terminals.
- Run 'npm start' on one terminal
- cd server/api/fetchAndProcessData/ and run 'node consumer.js'
- cd server and run 'node cronTab.js'


The cron runs every 5 minute to produce messages (jobs) for all the saved cryptoPairs and push them in the queue. The consumer then processes all the messages in the queue one by one and saves the consolidated data in the mongoDB database.