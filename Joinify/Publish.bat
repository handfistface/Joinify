
rem Copies the javascript structure to the ./Publish/ folder
robocopy ./Audio ./Publish/Audio /purge
robocopy ./Commands ./Publish/Commands /purge
robocopy ./Utilities ./Publish/Utilities /purge
robocopy ./.env ./Publish/.env /purge

rem copy files from the base directory
robocopy ./ ./Publish/ app.js /purge
robocopy ./ ./Publish/ package.json /purge
robocopy ./ ./Publish/ .env /purge

rem node_modules is big, don't copy it every time
robocopy ./node_modules ./Publish/node_modules /s
