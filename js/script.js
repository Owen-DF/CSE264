    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');

    
    var cups = [];
    var score = 0;
    var shotNum = 0;

    //ball constants
    var ballradius = 15;

    function Cup(x, y, radius, location, status) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.status = status;
        this.location = location;
        if (status == 'full') {
            this.color = 'orange';
        }else if (status == 'empty'){
            this.color = 'gray';
        }
    }       
    function initializeCups(){
        const cupRadius = 50;
        for(var i = 0; i < 15; i++){
            var cup = new Cup(0, 0, cupRadius, i, 'full');
            cups.push(cup);
        }
    }

    initializeCups();

    function drawBackgroundImage(ctx, backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
    var backgroundImage = new Image();
    backgroundImage.src = '../images/background.jpg';

    backgroundImage.onload = function() {
        drawBackgroundImage(ctx, backgroundImage);
        // Now, you can draw other elements on top of the background image
        // For example, draw cups, balls, etc.
    };


    function drawGameboard(canvasId) {
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext('2d');
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 1200;
        canvas.height = 600;
        // Draw game board background
        drawBackgroundImage(ctx, backgroundImage);
        

        // Draw cup holes
        var startX = 50;
        var startY = 100;
        //backrow
        for (var i = 0; i< 5; i++){
            cups[i].x = startX;
            cups[i].y = startY;
            startY +=100;
        }
        startY=150;
        startX += 100;
        for (i;i<9;i++){
            cups[i].x = startX;
            cups[i].y = startY;
            startY +=100;
        }
        startY=200;
        startX += 100;
        for(i;i<12;i++){
            cups[i].x = startX;
            cups[i].y = startY;
            startY +=100;
        }
        startY=250
        startX += 100;
        for(i;i<14;i++){
            cups[i].x = startX;
            cups[i].y = startY;
            startY +=100;
        }
        startY=300
        startX += 100;
        //front cup
        for(i;i<15;i++){
            cups[i].x = startX;
            cups[i].y = startY;
            startY +=100;
        }
        for (var i = 0; i < cups.length; i++) {
            drawCup(ctx, cups[i]);
        }

        //draw the ball
        drawBall(ctx,1000, 300, ballradius, 'red')

    }

    function drawCup(ctx, cup) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(cup.x, cup.y, cup.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = cup.color; // or any other color you prefer for the cup
        ctx.beginPath();
        ctx.arc(cup.x, cup.y, cup.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
    function drawBall(ctx, x, y, radius) {
        ctx.fillStyle = '#E5DDC5';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
        

    function launchBall(powerx, powery) {
        shotNum++;
        var canvas = document.getElementById('gameCanvas');
        var ctx = canvas.getContext('2d');
        

        // Update ball position based on power
        var ballX = 1000;
        var ballY = 300;
        var ballColor = 'black';
        var velocityX = powerx /10; // Adjust direction and magnitude of velocity
        var velocityY = powery/10; // Adjust direction and magnitude of velocity
       // console.log('velocityX:', velocityX, 'velocityY:', velocityY);
        var targetX = 1000 + 55*velocityX
        //var targetY = 300 + 16.67*velocityY;
        //console.log('targetX:', targetX, 'targetY:', targetY);

        function animate() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGameboard('gameCanvas');
            // Update ball position
            ballX += velocityX; 
            ballY += velocityY;

            // Draw ball
            drawBall(ctx, ballX, ballY, ballradius, ballColor);
            console.log('ballX:', ballX, 'ballY:', ballY);
            if (Math.abs(ballX - targetX) < Math.abs(velocityX) ) {
                // Ball has reached the target location, stop animation

                if(isInsideCup(ballX, ballY)){
                    console.log('ball inside cup');
                    initializeCups();
                    drawGameboard('gameCanvas');

                }
                return;
            }
            if (ballX < 0 || ballX > canvas.width || ballY < 0 || ballY > canvas.height) {
                // Ball has gone out of bounds, stop animation
                drawGameboard('gameCanvas');
                return;
            }
            // Request next frame
            requestAnimationFrame(animate);
        }
        // Start animation loop
        animate();
    }

    // Function to check if the click is inside the ball
function isInsideBall(mouseX, mouseY) {
    var dx = mouseX - 1000;
    var dy = mouseY - 300;
    return dx * dx + dy * dy <= 20 * 20;
}

function isInsideCup(ballX, ballY) {
    for (var i = 0; i < cups.length; i++) {
        var cup = cups[i];
        var dx = ballX - cup.x;
        var dy = ballY - cup.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var scoretext = document.getElementById('score');
    
        if (distance < cup.radius - ballradius && cup.status == 'full') {
            cup.status = 'empty';
            cup.color = 'grey';                            
            score +=1;
            scoretext.innerHTML = 'Score: ' + score + ' Shots: ' + shotNum;
            return true; // Ball is fully inside the cup
        }else if (distance < cup.radius - ballradius && cup.status == 'empty'){
            score -=1;
            scoretext.innerHTML = 'Score: ' + score + ' Shots: ' + shotNum;
            return false;
        }else{
            scoretext.innerHTML = 'Score: ' + score + ' Shots: ' + shotNum;
        }

    }
    return false; // Ball is not inside any cup
}





function drawLine(){
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(1000, 300);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.closePath();
}



// Event listener for click on canvas
canvas.addEventListener('mousedown', function(event) {
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    // Check if the click is inside the ball
    if (isInsideBall(mouseX, mouseY)) {
        console.log('mousedown inside ball');

        function mouseMoveHandler(event) {
            var rect = canvas.getBoundingClientRect();
            var mouseX = event.clientX - rect.left;
            var mouseY = event.clientY - rect.top;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGameboard('gameCanvas');
            drawLine();
        }

        function mouseUpHandler(event) {
            console.log('mouseup');
            var rect = canvas.getBoundingClientRect();
            var mouseX = event.clientX - rect.left;
            var mouseY = event.clientY - rect.top;
            var powerx = 1000 - mouseX;
            var powery = 300 - mouseY;
            launchBall(powerx, powery);

            // Remove event listeners after launching the ball
            canvas.removeEventListener('mousemove', mouseMoveHandler);
            canvas.removeEventListener('mouseup', mouseUpHandler);
        }

        // Add event listeners for mousemove and mouseup
        canvas.addEventListener('mousemove', mouseMoveHandler);
        canvas.addEventListener('mouseup', mouseUpHandler);
    }
});



    window.onload = function () {   
        drawGameboard('gameCanvas');
    };