// heartAnimation.js
function startHeartAnimation(canvasId, settings = {}) {
  const canvas = document.getElementById(canvasId);
  const context = canvas.getContext("2d");

  // 默认配置
  const defaultSettings = {
    particles: {
      length: 500, // 最大粒子数量
      duration: 2, // 粒子持续时间（秒）
      velocity: 100, // 粒子速度（像素/秒）
      effect: -0.75, // 粒子效果
      size: 30, // 粒子大小（像素）
    },
    text: {
      content: "❤我会永远陪着你", // 要显示的文字
      color: "#FFD1DC", // 文字颜色
      fontSize: 30, // 文字大小
      fontFamily: "Arial, sans-serif", // 字体
    },
  };

  // 合并用户配置和默认配置
  settings = { ...defaultSettings, ...settings };

  // Point 类
  class Point {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }

    clone() {
      return new Point(this.x, this.y);
    }

    length(length) {
      if (typeof length === "undefined") {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }
      this.normalize();
      this.x *= length;
      this.y *= length;
      return this;
    }

    normalize() {
      const length = this.length();
      this.x /= length;
      this.y /= length;
      return this;
    }
  }

  // Particle 类
  class Particle {
    constructor() {
      this.position = new Point();
      this.velocity = new Point();
      this.acceleration = new Point();
      this.age = 0;
    }

    initialize(x, y, dx, dy) {
      this.position.x = x;
      this.position.y = y;
      this.velocity.x = dx;
      this.velocity.y = dy;
      this.acceleration.x = dx * settings.particles.effect;
      this.acceleration.y = dy * settings.particles.effect;
      this.age = 0;
    }

    update(deltaTime) {
      this.position.x += this.velocity.x * deltaTime;
      this.position.y += this.velocity.y * deltaTime;
      this.velocity.x += this.acceleration.x * deltaTime;
      this.velocity.y += this.acceleration.y * deltaTime;
      this.age += deltaTime;
    }

    draw(context, image) {
      const ease = (t) => --t * t * t + 1;
      const size = image.width * ease(this.age / settings.particles.duration);
      context.globalAlpha = 1 - this.age / settings.particles.duration;
      context.drawImage(
        image,
        this.position.x - size / 2,
        this.position.y - size / 2,
        size,
        size
      );
    }
  }

  // ParticlePool 类
  class ParticlePool {
    constructor(length) {
      this.particles = new Array(length).fill().map(() => new Particle());
      this.firstActive = 0;
      this.firstFree = 0;
    }

    add(x, y, dx, dy) {
      this.particles[this.firstFree].initialize(x, y, dx, dy);
      this.firstFree = (this.firstFree + 1) % this.particles.length;
      if (this.firstActive === this.firstFree) {
        this.firstActive = (this.firstActive + 1) % this.particles.length;
      }
    }

    update(deltaTime) {
      for (
        let i = this.firstActive;
        i !== this.firstFree;
        i = (i + 1) % this.particles.length
      ) {
        this.particles[i].update(deltaTime);
      }
      while (
        this.particles[this.firstActive].age >= settings.particles.duration &&
        this.firstActive !== this.firstFree
      ) {
        this.firstActive = (this.firstActive + 1) % this.particles.length;
      }
    }

    draw(context, image) {
      for (
        let i = this.firstActive;
        i !== this.firstFree;
        i = (i + 1) % this.particles.length
      ) {
        this.particles[i].draw(context, image);
      }
    }
  }

  // 获取心形路径上的点
  function pointOnHeart(t) {
    return new Point(
      160 * Math.pow(Math.sin(t), 3),
      130 * Math.cos(t) -
        50 * Math.cos(2 * t) -
        20 * Math.cos(3 * t) -
        10 * Math.cos(4 * t) +
        25
    );
  }

  // 创建粒子图像
  function createParticleImage() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = settings.particles.size;
    canvas.height = settings.particles.size;

    function to(t) {
      const point = pointOnHeart(t);
      point.x =
        settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
      point.y =
        settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
      return point;
    }

    context.beginPath();
    let t = -Math.PI;
    let point = to(t);
    context.moveTo(point.x, point.y);
    while (t < Math.PI) {
      t += 0.01;
      point = to(t);
      context.lineTo(point.x, point.y);
    }
    context.closePath();
    context.fillStyle = "#FFD1DC";
    context.fill();

    const image = new Image();
    image.src = canvas.toDataURL();
    return image;
  }

  // 渲染动画
  function render(particles, image) {
    requestAnimationFrame(() => render(particles, image));
    const newTime = Date.now() / 1000;
    const deltaTime = newTime - (time || newTime);
    time = newTime;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const amount =
      (settings.particles.length / settings.particles.duration) * deltaTime;
    for (let i = 0; i < amount; i++) {
      const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
      const dir = pos.clone().length(settings.particles.velocity);
      particles.add(
        canvas.width / 2 + pos.x,
        canvas.height / 2 - pos.y,
        dir.x,
        -dir.y
      );
    }
    particles.update(deltaTime);
    particles.draw(context, image);
    // 在爱心中心添加文字
    const text = settings.text.content;
    const fontSize = settings.text.fontSize;
    const fontFamily = settings.text.fontFamily;
    const textColor = settings.text.color;

    context.fillStyle = textColor;
    context.font = `${fontSize}px ${fontFamily}`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // 计算爱心中心位置
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2.5;

    // 绘制文字
    context.fillText(text, centerX, centerY);
  }

  // 初始化
  const particles = new ParticlePool(settings.particles.length);
  const image = createParticleImage();
  let time;

  function onResize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  window.onresize = onResize;
  setTimeout(() => {
    onResize();
    render(particles, image);
  }, 10);
}
