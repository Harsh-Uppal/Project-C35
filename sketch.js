// JavaScript source code
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

//All Variables
var foodStock, dogImg, happyDogImg, database, nowImg, lastFed = -100000,frame = 0;

function SetImg() {
    database.ref("lastFed").on("value", (e) => {
        if (e.val() < frame - 100000) {
            nowImg = dogImg;
        }
        else {
            nowImg = happyDogImg;
        }
    });
}

function setup() {


    createCanvas(800, 700);

    engine = Engine.create();
    world = engine.world;

    //Give values to variables
    dogImg = loadImage("Dog.png");
    happyDogImg = loadImage("happydog.png");
    nowImg = dogImg;

    database = firebase.database();
    SetImg();

    foodStock = database.ref("foodStock");
    foodStock.on("value", function (data) {
        foodStock = data.val();
    });
    database.ref("lastFed").on("value", function (data) { lastFed = parseInt(data.val()); })
    database.ref("frame").on("value", function (data) { frame = parseInt(data.val()); })

}

function draw() {
    background("white");
    Engine.update(engine);

    //display objects
    text("FoodStock : " + foodStock, 200, 200);
    image(nowImg, 200, 400, 100, 100);
    if (lastFed < frame - 100000) {
        SetImg();
    }
    if (frame % 1000 == 0) {
        UpdateFrame();
        StopOverflow();
    }
    frame++;
}

function keyPressed() {
    //catch key presses
    if (keyCode == 13) {
        SetLastFed();
        SetImg();
        foodStock--;
        lastFed = frame;
        database.ref("foodStock").set(foodStock);
    }
}

function SetLastFed() {
    database.ref("lastFed").set(frame);
}

function UpdateFrame(){
    database.ref("frame").set(frame);
}

function StopOverflow() {
    database.ref("frame").set(frame - 1000);
    database.ref("lastFed").set(lastFed - 1000);
}