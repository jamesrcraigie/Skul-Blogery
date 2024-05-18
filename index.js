import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

var posts = [];
var currentId = 1;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.render("index.ejs", { 
        blogPosts: posts.sort((a, b) => {
            return b.rawDate - a.rawDate;
        })
    });
})

app.get("/create", (req, res) => {
    res.render("create.ejs");
});

app.get("/edit", (req, res) => {
    var post = getPostById(req.query.id);
    res.render("create.ejs", {
        blogPost: post
    });
});

app.get("/view", (req, res) => {
    var post = getPostById(req.query.id);
    res.render("view.ejs", {
        blogPost: post
    });
})

app.post("/search",(req, res) => {
    var searchWords = req.body.searchQuery.toLowerCase().split(" ");
    let matchingPosts = posts.filter(post =>
        searchWords.some(word => post.title.toLowerCase().includes(word))
    );
    res.render("index.ejs", { 
        blogPosts: matchingPosts.sort((a, b) => {
            return a.date - b.date;
        })
    });
});

app.post("/like", (req, res) => {
    let id = req.body.id;
    let post = getPostById(id);
    post.likes ++;
    if(req.body.view) {
        res.render("view.ejs", {
            blogPost: post
        });
    } else {
        res.redirect("/");
    }  
});

app.post("/delete", (req, res) => {
    posts = posts.filter(post => {
        post.id != req.body.id
    });
    res.redirect("/");

});

app.post("/save", (req, res) => {
    addPost(req.body.title, req.body.content);
    res.redirect("/");
});

app.post("/comment", (req, res) => {
    let id = req.body.id;
    addComment(id, req.body.comment);
    let post = getPostById(id);
    res.render("view.ejs", {
        blogPost: post
    });
})

app.post("/update", (req, res) => {
    console.log(req.body.id);
    var post = getPostById(req.body.id);
    post.title = req.body.title;
    post.bodyText = req.body.content;
    post.partialText = post.bodyText.substring(0,200) + "...";
    post.rawDate = new Date();
    post.date = post.rawDate.toLocaleString();
    res.redirect("/");
});

function addPost(title, bodyText)
{
    var post = new Post(title, bodyText);
    post.id = currentId;
    posts.push(post);
    currentId ++;
    
    return post.id;
}

function addComment(id, comment) 
{
    var post = getPostById(id);
    if(post !== null)
    {
        post.comments.push(comment);
    }
}

function getPostById(id)
{
    return posts.find(p => p.id == id);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    var id = addPost("Un-Beer-lievable Coincidence!", "I worked at a hotel that wasn’t doing too well, so it wasn’t very picky about who it would rent its bar/club area to for private parties. Some DJs had… unpleasant followings, which is another story — but it was also a college town, and this one is about fraternities.\nAs I was running around doing my duties, I caught a frat guy pouring himself a beer when the bar was busy. Because it was a private party, and because I didn’t want to turn the room against me, I didn’t throw him out the first time. I gave him that gift, and still, a few minutes later, I saw him doing it again.\nI told whichever person had booked the party that I had to throw his guy out, and he didn’t object — so no frat riot.\nI didn’t work at that place too much longer, and I eventually got a job on the same street bartending at a fine dining place with a cool new cocktail program. (This was the early 1990s, so that was a big deal.) It was a small place, and we were all one big family — owners, Front Of House, and Back Of House. I’m still friends with many of them years later.\nBut back to the ’90s. One of the kitchen guys and I rented an apartment together for a couple of years. We had some people over and were drinking some beers, talking about old times, when I relayed the frat-a**hole-who-poured-his-own-beer story. As I got to the end of the story, at the same time that I saw my roommate’s eyes widen, I flashed back to the face of the frat guy.\nIT WAS MY ROOMMATE!\nWe’d managed to be friends for like four years without realizing it." )
    var post = getPostById(id);
    post.likes = 3;
    post.comments.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin sagittis nisl rhoncus mattis rhoncus urna neque. Turpis cursus in hac habitasse platea dictumst. Vel risus commodo viverra maecenas accumsan lacus. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Ultrices eros in cursus turpis massa. Vulputate ut pharetra sit amet aliquam id diam maecenas. Sed cras ornare arcu dui vivamus arcu felis. Non consectetur a erat nam at lectus. Amet mattis vulputate enim nulla aliquet porttitor lacus luctus.");
    post.comments.push("Sed faucibus turpis in eu mi bibendum neque egestas congue. Maecenas volutpat blandit aliquam etiam erat velit scelerisque in dictum. Tincidunt praesent semper feugiat nibh sed pulvinar proin gravida. Porta non pulvinar neque laoreet suspendisse. Sed adipiscing diam donec adipiscing tristique risus nec feugiat in. Consectetur libero id faucibus nisl. Eget gravida cum sociis natoque penatibus et. Porttitor eget dolor morbi non arcu risus quis varius. Velit ut tortor pretium viverra suspendisse potenti. Dui vivamus arcu felis bibendum ut tristique et. Odio facilisis mauris sit amet massa vitae. Faucibus a pellentesque sit amet. Consectetur adipiscing elit duis tristique sollicitudin. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Gravida dictum fusce ut placerat orci nulla pellentesque.");
    post.comments.push("Vestibulum sed arcu non odio euismod. Est ante in nibh mauris cursus. Est ante in nibh mauris cursus mattis. Malesuada proin libero nunc consequat interdum varius sit. Tempor id eu nisl nunc mi. Sit amet dictum sit amet justo. Id aliquet risus feugiat in ante metus dictum. Malesuada bibendum arcu vitae elementum curabitur vitae nunc. Dui faucibus in ornare quam viverra orci sagittis eu. Turpis massa tincidunt dui ut ornare. Eget duis at tellus at urna condimentum mattis pellentesque. Massa tempor nec feugiat nisl pretium fusce. Vel quam elementum pulvinar etiam non quam lacus. Odio euismod lacinia at quis risus.");
    id = addPost("When Your Break Needs A Brake", "This is a story that has often been told to me by my parents, as I was way too young at the time to remember.\nMany years ago, in my single-digit years sometime during the 1990s (i.e. pre-9/11 era), my parents were taking me to a certain magical theme park on the east coast of the US. It was probably even my first trip, so of course, I was excited. With said center of magic being in Florida and us living in New York, this also meant my first plane ride. So, of course, we made our way to the airport, got through everything, got on the plane, and waited for it to take off.\nAnd waited. And waited. And waited, as it was massively delayed for one reason or another. Of course, a plane going to Orlando would be filled with lots of nervous, excitable children, so some of the stewardesses walked around and offered to take the young children up front to take a look at the cockpit.\nOf course, when they offered to take me up, my parents allowed the stewardess to take me forward and see all the fancy equipment and pilots and everything at the front. They sat in their seats, surely imagining that I was having a good time… when, suddenly, they felt the plane LURCH forward. It wasn’t taking off — just a sudden lurch out of nowhere.\nShortly after, the stewardess who had taken me up brought me back to my parents, and I got back into my seat. Curious, my mother asked just what had caused that strange lurch in the plane.\nStewardess: “Your son pulled the emergency brake.”");
    var post = getPostById(id);
    post.comments.push("Sure, the emergency brake - you know, the thing specifically designed to stop current movement - caused the plane to move and then stop.");
    post.comments.push("It's a curious story, and would only really make sense if the emergency brake was deployed to keep the plane from moving, and [Me] actually disengaged it so the plane went forward due to the engines being on and idling.");
    post.likes = 5;
})

function Post(title, bodyText)
{
    this.id = 0;
    this.title = title;
    this.bodyText = bodyText;
    this.rawDate = new Date ();
    this.date = this.rawDate.toLocaleString();
    this.comments = [];
    this.partialText = bodyText.substring(0,200) + "...";
    this.likes = 0;
}