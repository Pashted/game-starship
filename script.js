let canvas = $("#game"),
    context = canvas[0].getContext('2d'),


    fonimg = $('<img>', { src: 'images/fon.png' }),
    asterimg = $('<img>', { src: 'images/astero.png' }),
    shipimg = $('<img>', { src: 'images/ship01.png' }),
    fireimg = $('<img>', { src: 'images/fire.png' }),
    explimg = $('<img>', { src: 'images/expl222.png' }),
    shieldimg = $('<img>', { src: 'images/shield.png' }),

    aster = [],
    fire = [],
    expl = [],
    timer = 0,
    ship = { x: 300, y: 600 },
    shield = {
        x:      ship.x - 30,
        y:      ship.y - 15,
        animx:  0,
        animy:  0,
        active: 1
    },

    log = $('#score'),
    score = 0,
    status = $('.status');


canvas.on({
    mousemove(e) {
        ship.x = e.offsetX - 25;
        ship.y = e.offsetY - 13;
        shield.x = ship.x - 30;
        shield.y = ship.y - 15;
    }
});

let update = () => {
    timer++;

    // астероиды
    if (timer % 12 === 0) {
        aster.push({
            x:   Math.random() * 825,
            y:   -75,
            vx:  Math.random() * 2 - 1,
            vy:  Math.random() * 2 + 1,
            del: 0
        });
    }

    // выстрел
    if (timer % 20 === 0) {
        // console.log(fire.length, fire);
        fire.push({ x: ship.x + 23, y: ship.y, vx: 0, vy: -5.2 });
        fire.push({ x: ship.x + 23, y: ship.y, vx: 0.5, vy: -5 });
        fire.push({ x: ship.x + 23, y: ship.y, vx: -0.5, vy: -5 });
    }

    // движение пуль
    for (let i in fire) {
        fire[i].x += fire[i].vx;
        fire[i].y += fire[i].vy;
        if (fire[i].y < -30) fire.splice(i, 1);
    }

    // анимация взрывов
    for (let i in expl) {
        expl[i].animx += 0.5; // скорость взрыва
        if (expl[i].animx > 7) {
            expl[i].animy++;
            expl[i].animx = 0;
        }
        if (expl[i].animy > 6)
            expl.splice(i, 1);
    }

    // щит
    if (shield.active) {
        shield.animx += 0.5; // скорость пульсации щита
        if (shield.animx > 4) {
            shield.animy++;
            shield.animx = 0;
        }
        if (shield.animy > 7) {
            shield.animx = 0;
            shield.animy = 0;
        }
    }

    // движение астероидов
    for (let i in aster) {
        aster[i].x += aster[i].vx;
        aster[i].y += aster[i].vy;


        if (aster[i].x >= 825 || aster[i].x < 0) aster[i].vx = -aster[i].vx;
        if (aster[i].y >= 900) aster.splice(i, 1);

        for (let j in fire) {

            if (Math.abs(aster[i].x + 37.5 - fire[j].x - 15) < 50 &&
                Math.abs(aster[i].y - fire[j].y) < 25) {
                // столкновение пули с астероидом

                expl.push({
                    x:     aster[i].x - 14,
                    y:     aster[i].y - 14,
                    animx: 0,
                    animy: 0
                });

                aster[i].del = 1;
                fire.splice(j, 1);

                break;
            }

        }

        if (Math.abs(aster[i].x + 37.5 - ship.x - 37.5) < 75 &&
            Math.abs(aster[i].y + 37.5 - ship.y - 19.5) < 50) {
            console.log(123);
            status.append('. ');

        }

        if (aster[i].del === 1) {
            aster.splice(i, 1);
            score += 1;
            log.html(score);
        }


    }
    // if (aster.y >= 825) aster.y = 825;
};

let render = () => {
    context.drawImage(fonimg[0], 0, 0, 900, 900);
    context.drawImage(shipimg[0], ship.x, ship.y, 75, 39);


    for (let i in fire)
        context.drawImage(fireimg[0], fire[i].x, fire[i].y, 30, 30);

    for (let i in aster)
        context.drawImage(asterimg[0], aster[i].x, aster[i].y, 75, 75);

    for (let i in expl)
        context.drawImage(
            explimg[0], 128 * Math.floor(expl[i].animx), 128 * Math.floor(expl[i].animy),
            128, 128,
            expl[i].x, expl[i].y,
            100, 100
        );

    context.drawImage(
        shieldimg[0], 192 * Math.floor(shield.animx), 192 * Math.floor(shield.animy),
        192, 192,
        shield.x, shield.y,
        192 * 0.7, 192 * 0.5
    );

};


let requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 20);
            console.log(123);
        };
})();


let game = () => {
    update();
    render();
    requestAnimFrame(game);
};

fonimg.on({ load: game });