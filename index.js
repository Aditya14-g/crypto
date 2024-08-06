import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import fetch from "node-fetch";

const port = 3000;
const app = express();
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "crypto",
    password: "jokofi",
    port: 5432,
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("../first.ejs");
});

app.post("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/thanks", async (req, res) => {
    const result = req.body;
    console.log(result);
    await db.query("INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3)", [result.first_name, result.last_name, result.password]);
    res.render("thankyou.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/main", async (req, res) => {
    console.log(req.body);
    try {
        const result = await db.query("SELECT first_name FROM users WHERE password=$1", [req.body.password]);
        if (result.rows.length === 0) {
            console.log("password error");
            res.redirect("/login");
        } else if (result.rows[0].first_name === req.body.first_name) {
            res.render("Page/main.ejs");
        } else if (result.rows[0].first_name !== req.body.first_name) {
            console.log("name error");
            res.redirect("/login", { nameerr: "Wrong name" });
        }
    } catch (err) {
        console.log(err);
        res.redirect("/login", { passworderr: "Wrong password" });
    }
});

app.get("/main", async (req, res) => {
    res.render("Page/main.ejs");
});

app.get("/currency", async (req, res) => {
    let crypto = req.query.name;
    let linked = crypto.toLowerCase();
    console.log(linked);
    let bit = {};
    if (linked === 'bnb') {
        bit = await (await fetch("https://api.coingecko.com/api/v3/coins/binancecoin")).json();
    } else {
        bit = await (await fetch(`https://api.coingecko.com/api/v3/coins/${linked}`)).json();
    }
    console.log(bit.market_data.current_price.usd);
    res.render("bitcoin.ejs", {
        price: bit.market_data.current_price.usd,
        name: crypto,
        image: crypto,
        ath: bit.market_data.ath.usd,
        ath_per: bit.market_data.ath_change_percentage.usd,
        ath_date: bit.market_data.ath_date.usd,
        atl: bit.market_data.atl.usd,
        atl_per: bit.market_data.atl_change_percentage.usd,
        atl_date: bit.market_data.atl_date.usd,
        high: bit.market_data.high_24h.usd,
        low: bit.market_data.low_24h.usd,
        seven: bit.market_data.price_change_percentage_7d_in_currency.usd,
        thirty: bit.market_data.price_change_percentage_30d_in_currency.usd,
        oneyear: bit.market_data.price_change_percentage_1y_in_currency.usd
    });
});

app.get("/search", (req, res) => {
    res.render("search.ejs");
});

app.post("/crypto-search", async (req, res) => {
    // console.log(req.body.search);
    let crypto = req.body.search.toLowerCase();
    let result = await (await fetch(`https://api.coingecko.com/api/v3/search?query=${crypto}`)).json();
    // console.log(result.coins[0]);
    let cryptoCoins = result.coins[0];
    let bit = await (await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoCoins.id}`)).json();
    // console.log(cryptoCoins.id);
    // console.log(bit.market_data);
    let priceone=await(await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoCoins.id}/market_chart?vs_currency=usd&days=1`)).json();
    let graphone=[];
    for(let i=0;i<priceone.prices.length;i++){
        // console.log(priceone.prices[i][1]);
        graphone.push(priceone.prices[i][1]);
    }
    
    res.render("crypto-search.ejs", {
        cryptocoin: cryptoCoins,
        info: bit.market_data,
        previousPric: bit.market_data.current_price.usd, // Assuming you are comparing it with the current price.
        graphone: graphone 
    });
});
app.get("/Mycrypto",(req,res)=>{
    res.render("Page/mycryptologin.ejs");
})
app.get("/about",(req,res)=>{
    res.render("aboutme.ejs");
})
app.listen(port, () => {
    console.log("Connected to the port.");
});
