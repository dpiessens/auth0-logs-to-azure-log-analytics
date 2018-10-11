module.exports=function(e){function t(s){if(n[s])return n[s].exports;var r=n[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,s){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:s})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=12)}([function(e,t,n){"use strict";e.exports=n(4).config()},function(e,t){e.exports=require("auth0-extension-express-tools@1.1.6")},function(e,t,n){"use strict";var s=n(26);s.emitErrs=!0;var r=new s.Logger({transports:[new s.transports.Console({timestamp:!0,level:"debug",handleExceptions:!0,json:!1,colorize:!0})],exitOnError:!1});e.exports=r,e.exports.stream={write:function(e){r.info(e.replace(/\n$/,""))}}},function(e,t){e.exports=require("express@4.12.4")},function(e,t){e.exports=require("auth0-extension-tools@1.3.1")},function(e,t){e.exports=require("path")},function(e,t,n){"use strict";(function(t){var s=n(5),r=n(24),o=n(3),i=n(18),a=n(4),u=n(1),l=n(10),c=n(11),p=n(8),d=n(2),f=n(0),g=n(7);e.exports=function(e,n){f.setProvider(e);var x=n?new a.WebtaskStorageContext(n,{force:1}):new a.FileStorageContext(s.join(t,"./data.json"),{mergeWrites:!0}),v=new o;v.use(r(":method :url :status :response-time ms - :res[content-length]",{stream:d.stream}));var h=function(e){return function(t,n,s){return t.webtaskContext&&t.webtaskContext.body?(t.body=t.webtaskContext.body,s()):e(t,n,s)}};return v.use(h(i.json())),v.use(h(i.urlencoded({extended:!1}))),v.use(u.routes.dashboardAdmins({secret:f("EXTENSION_SECRET"),audience:"urn:logs-to-azure-log-analytics",domain:f("AUTH0_DOMAIN"),rta:f("AUTH0_RTA").replace("https://",""),baseUrl:f("PUBLIC_WT_URL")||f("WT_URL"),clientName:"Logs to Azure Log Analytics",urlPrefix:"",sessionStorageKey:"logs-to-azure-log-analytics:apiToken"})),v.use("/meta",c()),v.use("/.extensions",p()),v.use("/app",o.static(s.join(t,"../dist"))),v.use(g(x)),v.use("/",l(x)),v.use(u.middlewares.errorHandler(d.error.bind(d))),v}}).call(t,"/")},function(e,t,n){"use strict";var s=n(13),r=function(e){return e&&e.__esModule?e:{default:e}}(s),o=n(23),i=n(19),a=n(25),u=n(17),l=n(0),c=n(2);e.exports=function(e){return function(t,n,s){var p=t.webtaskContext&&t.webtaskContext.body||t.body||{},d=t.webtaskContext&&t.webtaskContext.headers||{};if(!(p.schedule&&"active"===p.state||d.referer===l("AUTH0_MANAGE_URL")+"/"&&d["if-none-match"]))return s();var f=function(e,t,n,s){var o=(new Date).toUTCString(),u=(0,r.default)(n),l=Buffer.byteLength(u,"utf8"),p="POST\n"+l+"\napplication/json\nx-ms-date:"+o+"\n/api/logs",d=i.createHmac("sha256",new Buffer(t,"base64")).update(p,"utf-8").digest("base64"),f="SharedKey "+e+":"+d,g={"content-type":"application/json",Authorization:f,"Log-Type":"Auth0Logs","x-ms-date":o,"time-generated-field":"date"},x="https://"+e+".ods.opinsights.azure.com/api/logs?api-version=2016-04-01";a.post({url:x,headers:g,body:u},function(e,t,n){e?(c.error("Error sending logs to Azure Log Analytics: "+e+", Response: "+t+", Body: "+n),s(e)):s(null)})},g=function(e,t){e&&e.length||t(),f(l("LOG_ANALYTICS_WORKSPACE_ID"),l("LOG_ANALYTICS_SHARED_KEY"),e,function(n){return n?t(n):(c.info(e.length+" events successfully sent to Azure log analytics."),t())})},x=function(e,t){return e&&e.length?(c.info(e.length+" logs received."),g(e,t)):t()},v=new u.reporters.SlackReporter({hook:l("SLACK_INCOMING_WEBHOOK_URL"),username:"logs-to-azure-log-analytics",title:"Logs To Azure Log Analytics"}),h={domain:l("AUTH0_DOMAIN"),clientId:l("AUTH0_CLIENT_ID"),clientSecret:l("AUTH0_CLIENT_SECRET"),batchSize:l("BATCH_SIZE"),startFrom:l("START_FROM"),logTypes:l("LOG_TYPES"),logLevel:l("LOG_LEVEL")};(!h.batchSize||h.batchSize>100)&&(h.batchSize=100),h.logTypes&&!Array.isArray(h.logTypes)&&(h.logTypes=h.logTypes.replace(/\s/g,"").split(","));var m=new u.LogsProcessor(e,h),_=function(t){var n=new Date,s=n.getTime(),r=s-864e5;m.getReport(r,s).then(function(e){return v.send(e,e.checkpoint)}).then(function(){return e.read()}).then(function(n){return n.lastReportDate=t,e.write(n)})},y=function(){e.read().then(function(e){var t=o().format("DD-MM-YYYY"),n=l("DAILY_REPORT_TIME")||16;e.lastReportDate!==t&&(new Date).getHours()>=n&&_(t)})};return m.run(x).then(function(e){e&&e.status&&e.status.error?v.send(e.status,e.checkpoint):!0!==l("SLACK_SEND_SUCCESS")&&"true"!==l("SLACK_SEND_SUCCESS")||v.send(e.status,e.checkpoint),y(),n.json(e)}).catch(function(e){v.send({error:e,logsProcessed:0},null),y(),s(e)})}}},function(e,t,n){"use strict";var s=n(3).Router,r=n(4),o=n(1).middlewares,i=n(0),a=n(2);e.exports=function(){var e=s(),t=o.validateHookToken(i("AUTH0_DOMAIN"),i("WT_URL"),i("EXTENSION_SECRET"));return e.use("/on-uninstall",t("/.extensions/on-uninstall")),e.delete("/on-uninstall",function(e,t){var n=i("AUTH0_CLIENT_ID"),s={domain:i("AUTH0_DOMAIN"),clientSecret:i("AUTH0_CLIENT_SECRET"),clientId:n};r.managementApi.getClient(s).then(function(e){return e.clients.delete({client_id:n})}).then(function(){a.debug("Deleted client "+n),t.sendStatus(204)}).catch(function(e){a.debug("Error deleting client: "+n),a.error(e),t.sendStatus(204)})}),e}},function(e,t,n){"use strict";(function(t){var s=(n(21),n(20)),r=(n(5),n(1).urlHelpers),o=n(0);e.exports=function(){var e='\n  <!DOCTYPE html>\n  <html lang="en">\n  <head>\n    <title><%= config.TITLE %></title>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css" />\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css" />\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.min.css" />\n    <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>" /><% } %>\n    <% if (assets.customCss) { %><link rel="stylesheet" type="text/css" href="<%= assets.customCss %>" /><% } %>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script type="text/javascript" src="//cdn.auth0.com/w2/auth0-7.0.4.min.js"><\/script>\n    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"><\/script>\n    <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;<\/script>\n    <% if (assets.vendors) { %><script type="text/javascript" src="<%= assets.vendors %>"><\/script><% } %>\n    <% if (assets.app) { %><script type="text/javascript" src="<%= assets.app %>"><\/script><% } %>\n  </body>\n  </html>\n  ';return function(t,n,i){if(0===t.url.indexOf("/api"))return i();var a={AUTH0_DOMAIN:o("AUTH0_DOMAIN"),AUTH0_CLIENT_ID:o("EXTENSION_CLIENT_ID"),AUTH0_MANAGE_URL:o("AUTH0_MANAGE_URL")||"https://manage.auth0.com",BASE_URL:r.getBaseUrl(t),BASE_PATH:r.getBasePath(t),TITLE:o("TITLE")};return n.send(s.render(e,{config:a,assets:{customCss:o("CUSTOM_CSS"),version:"1.0.0"}}))}}}).call(t,"/")},function(e,t,n){"use strict";var s=n(22),r=n(3).Router,o=n(1).middlewares,i=n(0),a=n(9);e.exports=function(e){var t=r(),n=o.authenticateAdmins({credentialsRequired:!0,secret:i("EXTENSION_SECRET"),audience:"urn:logs-to-azure-log-analytics",baseUrl:i("PUBLIC_WT_URL")||i("WT_URL"),onLoginSuccess:function(e,t,n){return n()}});return t.get("/",a()),t.get("/api/report",n,function(t,n,r){return e.read().then(function(e){var r=e&&e.logs?s.sortByOrder(e.logs,"start","desc"):[],o=t.query.filter&&"errors"===t.query.filter?s.filter(r,function(e){return!!e.error}):r,i=t.query.page&&parseInt(t.query.page,10)?parseInt(t.query.page,10)-1:0,a=t.query.per_page&&parseInt(t.query.per_page,10)||10,u=a*i;return n.json({logs:o.slice(u,u+a),total:o.length})}).catch(r)}),t}},function(e,t,n){"use strict";var s=n(3),r=n(16);e.exports=function(){var e=s.Router();return e.get("/",function(e,t){t.status(200).send(r)}),e}},function(e,t,n){"use strict";var s=n(1),r=n(6),o=n(0),i=n(2),a=s.createServer(function(e,t){return i.info("Starting Auth0 Logs to Azure Log Analytics Extension - Version:","1.0.0"),r(e,t)});e.exports=function(e,t,n){o.setValue("PUBLIC_WT_URL",s.urlHelpers.getWebtaskUrl(t)),a(e,t,n)}},function(e,t,n){e.exports={default:n(14),__esModule:!0}},function(e,t,n){var s=n(15),r=s.JSON||(s.JSON={stringify:JSON.stringify});e.exports=function(e){return r.stringify.apply(r,arguments)}},function(e,t){var n=e.exports={version:"2.5.7"};"number"==typeof __e&&(__e=n)},function(e,t){e.exports={title:"Logs to Azure Log Analytics",name:"logs-to-azure-log-analytics",version:"1.0.0",author:"dpiessens",description:"Logs and export them to Azure Log Analytics",type:"cron",keywords:["dpiessens","extension"],category:"log_export",initialUrlPath:"/login",schedule:"0 */5 * * * *",auth0:{createClient:!0,onUninstallPath:"/.extensions/on-uninstall",scopes:"read:logs delete:clients"},secrets:{BATCH_SIZE:{description:"The ammount of logs to be read on each execution. Maximum is 100.",default:100},LOG_ANALYTICS_WORKSPACE_ID:{description:"Azure Log Analytics Workspace ID",required:!0},LOG_ANALYTICS_SHARED_KEY:{description:"Azure Log Analytics Workspace Shared Key",required:!0},START_FROM:{description:"Checkpoint ID of log to start from."},SLACK_INCOMING_WEBHOOK_URL:{description:"Slack Incoming Webhook URL used to report statistics and possible failures"},SLACK_SEND_SUCCESS:{description:"This setting will enable verbose notifications to Slack which are useful for troubleshooting",type:"select",allowMultiple:!1,default:"false",options:[{value:"false",text:"No"},{value:"true",text:"Yes"}]},LOG_LEVEL:{description:"This allows you to specify the log level of events that need to be sent",type:"select",allowMultiple:!0,options:[{value:"-",text:""},{value:"0",text:"Debug"},{value:"1",text:"Info"},{value:"2",text:"Warning"},{value:"3",text:"Error"},{value:"4",text:"Critical"}]},LOG_TYPES:{description:"If you only want to send events with a specific type (eg: failed logins)",type:"select",allowMultiple:!0,options:[{text:"",value:"-"},{text:"Success Login",value:"s"},{text:"Success Exchange",value:"seacft"},{text:"Success Exchange (Client Credentials)",value:"seccft"},{text:"Failed Exchange",value:"feacft"},{text:"Failed Exchange (Client Credentials)",value:"feccft"},{text:"Failed Login",value:"f"},{text:"Warnings During Login",value:"w"},{text:"Deleted User",value:"du"},{text:"Failed Login (invalid email/username)",value:"fu"},{text:"Failed Login (wrong password)",value:"fp"},{text:"Failed by Connector",value:"fc"},{text:"Failed by CORS",value:"fco"},{text:"Connector Online",value:"con"},{text:"Connector Offline",value:"coff"},{text:"Failed Connector Provisioning",value:"fcpro"},{text:"Success Signup",value:"ss"},{text:"Failed Signup",value:"fs"},{text:"Code Sent",value:"cs"},{text:"Code/Link Sent",value:"cls"},{text:"Success Verification Email",value:"sv"},{text:"Failed Verification Email",value:"fv"},{text:"Success Change Password",value:"scp"},{text:"Failed Change Password",value:"fcp"},{text:"Success Change Email",value:"sce"},{text:"Failed Change Email",value:"fce"},{text:"Success Change Username",value:"scu"},{text:"Failed Change Username",value:"fcu"},{text:"Success Change Phone Number",value:"scpn"},{text:"Failed Change Phone Number",value:"fcpn"},{text:"Success Verification Email Request",value:"svr"},{text:"Failed Verification Email Request",value:"fvr"},{text:"Success Change Password Request",value:"scpr"},{text:"Failed Change Password Request",value:"fcpr"},{text:"Failed Sending Notification",value:"fn"},{text:"API Operation",value:"sapi"},{text:"Failed API Operation",value:"fapi"},{text:"Blocked Account",value:"limit_wc"},{text:"Too Many Calls to /userinfo",value:"limit_ui"},{text:"Rate Limit On API",value:"api_limit"},{text:"Successful User Deletion",value:"sdu"},{text:"Failed User Deletion",value:"fdu"},{text:"Blocked Account",value:"limit_wc"},{text:"Blocked IP Address",value:"limit_mu"},{text:"Success Logout",value:"slo"},{text:"Failed Logout",value:"flo"},{text:"Success Delegation",value:"sd"},{text:"Failed Delegation",value:"fd"}]}}}},function(e,t){e.exports=require("auth0-log-extension-tools@1.3.6")},function(e,t){e.exports=require("body-parser@1.12.4")},function(e,t){e.exports=require("crypto")},function(e,t){e.exports=require("ejs@2.3.1")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("lodash@3.10.1")},function(e,t){e.exports=require("moment@2.10.3")},function(e,t){e.exports=require("morgan@1.5.3")},function(e,t){e.exports=require("request@2.56.0")},function(e,t){e.exports=require("winston@1.0.0")}]);