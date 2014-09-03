local:
	cp server_local.js server.js
	cp config/express_local.js config/express.js
	
server:
	cp server_remote.js server.js
	cp config/express_remote.js config/express.js

masterserver:
	cp server_remote_master.js server.js
	cp config/express_remote.js config/express.js
