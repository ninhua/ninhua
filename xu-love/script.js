let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");

const params = new URLSearchParams(window.location.search);
let username = params.get("name");

// 限制用户名长度，避免页面样式崩坏
const maxLength = 20;
const safeUsername = username ? username.substring(0, maxLength) : "???";

// 防止 `null` 变成 `"null"`
if (username) {
  questionText.innerText = questionText.innerText + safeUsername;
}

let clickCount = 0; // 记录点击 No 的次数

// No 按钮的文字变化
const noTexts = [
  "啵啵？你认真的吗…",
  "啵啵要不再想想？",
  "啵啵不许选这个！",
  "啵啵我会很伤心…",
  "不可以啵啵:( ",
  "啵啵，这个好像不太行哦~",
  "哎呀，这个选项有点“危险”呢！",
  "啵啵，你是不是迷糊啦？",
  "这个选项，我可要打个叉叉哦！",
  "不行哦，啵啵，换个试试吧~",
  "啵啵，这个不行啦，别调皮！",
  "要是你选这个，我会哭的哦~",
  "这个不行呢，换个别的吧~",
  "啵啵，这个选项有点“坏坏”哦！",
  "别选这个啦，我不会同意的！",
  "这个选项好像有点“怪怪”的呢！",
  "不行不行，这个不符合规则哦！",
  "这个选项有点“离谱”啦，换一个吧！",
  "哎呀，这个不行，我会生气的哦！",
  "这个选项好像有点“小众”呢，试试别的吧！",
  "这个不行哦，我可不允许你选这个！",
  "这个选项好像有点“奇怪”呢，换个别的吧！",
  "不行不行，这个选项有点“怪怪”的呢！",
  "这个选项好像有点“不合适”呢，换一个吧！",
];

// No 按钮点击事件
noButton.addEventListener("click", function () {
  clickCount++;

  // 让 Yes 变大，每次放大 2 倍
  let yesSize = 1 + clickCount * 1.2;
  yesButton.style.transform = `scale(${yesSize})`;

  // 挤压 No 按钮，每次右移 50px
  let noOffset = clickCount * 50;
  noButton.style.transform = `translateX(${noOffset}px)`;

  // 让图片和文字往上移动
  let moveUp = clickCount * 25;
  mainImage.style.transform = `translateY(-${moveUp}px)`;
  questionText.style.transform = `translateY(-${moveUp}px)`;

  // No 文案变化（前 5 次变化）
  if (clickCount <= 25) {
    noButton.innerText = noTexts[clickCount - 1];
  }

  // 图片变化（前 5 次变化）
  if (clickCount === 1) mainImage.src = "images/shocked.png"; // 震惊
  if (clickCount === 2) mainImage.src = "images/think.png"; // 思考
  if (clickCount === 3) mainImage.src = "images/angry.png"; // 生气
  if (clickCount === 4) mainImage.src = "images/crying.png"; // 哭
  if (clickCount >= 5) mainImage.src = "images/crying.png"; // 之后一直是哭
});

// Yes 按钮点击后，进入表白成功页面
const loveTest = `!!!喜欢你!! ( >᎑<)♡︎ᐝ  ${
  username ? `${safeUsername}  ♡︎ᐝ(>᎑< )` : ""
}`;

yesButton.addEventListener("click", function () {
  // 先创建基础 HTML 结构
  document.body.innerHTML = `
        <div class="yes-screen">
            <h1 class="yes-text"></h1>
            <img src="images/hug.png" alt="拥抱" class="yes-image">
        </div>
    `;

  // 确保用户名安全地插入
  document.querySelector(".yes-text").innerText = loveTest;

  // 禁止滚动，保持页面美观
  document.body.style.overflow = "hidden";
});
