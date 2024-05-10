import P5 from 'p5';
import { Player as BasePlayer } from 'common';
import { socket } from './socket';

// type Point = [number, number];
// type Line = Point[];

type Player = BasePlayer & {
  thisIsMe?: boolean;
};

socket.off();

const sketch = (p: P5) => {
  // const lines: Line[] = [];
  // let currentLine: Line = [];

  const fontSize = 24;

  const room = {
    id: 0,
    playerCount: 0,
  };

  let playersLocal: Player[] = [];

  let playerMe: Player | undefined;

  let g: P5.Graphics;

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);

    g = p.createGraphics(p.width, p.height);

    socket.on('connect', () => {
      console.log('Connected to server');

      socket.emit(
        'player:create',
        {
          name: crypto.randomUUID().substring(0, 6),
          position: [p.mouseX, p.mouseY],
          color: p.color(p.random(255), p.random(255), p.random(255)).toString(),
          isDrawing: false,
        },
        (res) => {
          if (res.data) {
            playerMe = res.data;
          }
        },
      );
    });

    socket.on('player:list', (players) => {
      room.playerCount = players.length;
      playersLocal = players;

      for (let i = 0; i < playersLocal.length; i++) {
        if (playersLocal[i].id === playerMe?.id) {
          playersLocal[i].thisIsMe = true;
        }
      }
    });

    socket.on('player:updated', (player) => {
      const playerIndex = playersLocal.findIndex((p) => p.id === player.id);

      if (playerIndex !== -1) {
        playersLocal[playerIndex] = player;
      }
      // console.log(res);
    });

    socket.on('player:startedDrawing', (playerId) => {
      const playerIndex = playersLocal.findIndex((p) => p.id === playerId);

      if (playerIndex !== -1) {
        playersLocal[playerIndex].isDrawing = true;
      }
    });

    socket.on('player:stoppedDrawing', (playerId) => {
      const playerIndex = playersLocal.findIndex((p) => p.id === playerId);

      if (playerIndex !== -1) {
        playersLocal[playerIndex].isDrawing = false;
      }
    });
  };

  p.draw = () => {
    g.background(255, 1);
    p.background(255);

    // drawLines(g);

    if (playerMe && playerMe.isDrawing) {
      g.fill(playerMe.color);
      g.noStroke();
      g.ellipse(p.mouseX, p.mouseY, 8);
    }

    for (let i = 0; i < playersLocal.length; i++) {
      if (playersLocal[i].isDrawing) {
        g.fill(playersLocal[i].color);
        g.noStroke();
        g.ellipse(playersLocal[i].position[0], playersLocal[i].position[1], 8);
      }
    }

    p.image(g, 0, 0);

    drawPlayers(p);

    if (playerMe) {
      drawPlayer(p, playerMe);
    }
  };

  p.mouseMoved = () => {
    updatePlayerPosition();
  };

  p.mousePressed = () => {
    // currentLine = [];

    if (playerMe) {
      socket.emit('player:startDrawing', playerMe.id, () => {
        playerMe!.isDrawing = true;
      });
    }
  };

  p.mouseDragged = () => {
    // currentLine.push([p.mouseX, p.mouseY]);
    // lines[lines.length] = [...currentLine];

    updatePlayerPosition();
  };

  p.mouseReleased = () => {
    if (playerMe) {
      socket.emit('player:stopDrawing', playerMe.id, () => {
        playerMe!.isDrawing = false;
      });
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    g.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  function updatePlayerPosition() {
    if (playerMe) {
      playerMe.position = [p.mouseX, p.mouseY];
      socket.emit('player:update', playerMe, () => {
        // console.log('player updated', player);
      });
    }
  }

  function drawPlayers(p: P5.Graphics | P5) {
    for (let i = 0; i < playersLocal.length; i++) {
      if (!playersLocal[i].thisIsMe) {
        drawPlayer(p, playersLocal[i]);
      }
    }
  }

  function drawPlayer(p: P5.Graphics | P5, player: Player) {
    p.textSize(fontSize);
    p.textAlign(p.CENTER, p.CENTER);

    const w = p.drawingContext.measureText(player.name).width * 1.2;
    const h = fontSize * 1.2;

    p.fill(player.color);
    p.rect(player.position[0] - w / 2, player.position[1] - h / 1.2 - 10, w, h);

    p.noStroke();

    p.fill(255);
    p.text(player.name, player.position[0], player.position[1] - h / 1.5);

    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Room : ${room.id}`, 10, 10);
    p.text(`Players : ${room.playerCount}`, 10, 30);
  }

  // function drawLines(p: P5.Graphics) {
  //   for (let i = 0; i < lines.length; i++) {
  //     drawLine(p, lines[i]);

  //     if (lines[i].length === 0) {
  //       lines.shift();
  //     }
  //   }
  // }

  // function drawLine(p: P5.Graphics, line: Line) {
  //   p.noFill();
  //   p.stroke('#f00');
  //   p.strokeWeight(2);
  //   p.beginShape();
  //   for (let i = 0; i < line.length; i++) {
  //     p.vertex(line[i][0], line[i][1]);
  //   }
  //   p.endShape();

  //   line.shift();
  // }

  window.onbeforeunload = () => {
    if (playerMe) {
      socket.emit('player:delete', playerMe.id, (res) => {
        console.log('player left', res.data);
      });
    }
  };
};

new P5(sketch, document.body);
