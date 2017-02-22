const fs = require("fs");
const path = require("path");
const Logger = require("nice-logger");
const Router = require("nice-router");

const log = new Logger("blog", "debug");
const router = new Router();

// router.useHTTPS({
//     key: fs.readFileSync(process.env["SSL_KEY"] || "/etc/secrets/key.pem");
//     cert: fs.readFileSync(process.env["SSL_CERT"] || "/etc/secrets/cert.pem");
// });

router.addRoute("/posts", "GET", function(req, res) {
    fs.readdir(path.resolve(process.env["POSTS_DIR"] || "posts"), function(err, files) {
        if (err) {
            res.writeHead(500);
            res.end(err.toString());
            log.error(err);
            return;
        }
        const filesSplit = [];
        let sp;
        for (let i=0, len=files.length; i<len; i++) {
            sp = files[i].split("_");
            if (sp.length < 2) {
                res.writeHead(500);
                const msg = "Invalid filename " + files[i];
                res.end(msg);
                log.error(msg);
                break;
            }
            filesSplit.push({"ts": sp[0], "name": sp[1]});
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(filesSplit));
    });
});

router.addStaticDir("/posts");

router.listen(process.env["PORT"] || 8080);
