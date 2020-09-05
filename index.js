const express = require('express')
const app = express()

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
app.engine('handlebars', exphbs({
    layoutsDir: "views/layouts/"
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'))

const moment = require("moment");
//moment().fromNow();

//const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const SettingsBill = require('./setting-bill-function')
const settingsBill = SettingsBill()


app.get('/', function (req, res) {
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        color: settingsBill.color()
    })
})

app.post('/settings', function (req, res) {

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })

    res.redirect('/')

})

app.post('/action', function (req, res) {
    console.log(req.body.ItemType)

    settingsBill.recordAction(req.body.ItemType)

    res.redirect('/')

})

app.get('/actions', function (req, res) {
    var action = settingsBill.actions();
    for (let props of action) {
        props.stamp = moment(props.timeStamp).fromNow()
    }
    res.render("actions", { actions: action });
})

app.get('/actions/:actionType', function (req, res) {
    const actionType = req.params.actionType;
    let actionList = settingsBill.actionsFor(actionType);
    for (let props of actionList) {
        props.stamp = moment(props.timeStamp).fromNow();
    }
    res.render("actions", { actions: actionList });
})


const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
})