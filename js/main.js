var board = new Array()
var score = 0
var hasConflicted = new Array()

var startx = 0
var starty = 0
var endx = 0
var endy = 0

$(document).ready(function () {
  prepareForMobile()
  newgame()
})
function prepareForMobile() {
  if (documentWidth > 500) {//pc端
    gridContainerWidth = 500
    cellSapce = 20
    cellSideLength = 100
  } else {//移动端
    $('#grid-container').css('margin-top', 350)
    $('#newgame').hide();
    $('#help').hide();
  }

  $('#grid-container').css('width', gridContainerWidth - 2 * cellSapce)
  $('#grid-container').css('height', gridContainerWidth - 2 * cellSapce)
  $('#grid-container').css('padding', cellSapce)
  $('#grid-container').css('border-radius', 0.02 * gridContainerWidth)

  $('.grid-cell').css('width', cellSideLength)
  $('.grid-cell').css('height', cellSideLength)
  $('.grid-cell').css('border-radius', 0.02 * cellSideLength)
}

function newgame() {
  init()
  generateOneNumber()
  generateOneNumber()
}

function init() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $('#grid-cell-' + i + '-' + j)
      gridCell.css('top', getPosTop(i, j))
      gridCell.css('left', getPosLeft(i, j))
    }
  }

  for (var i = 0; i < 4; i++) {
    board[i] = new Array()
    hasConflicted[i] = new Array()
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0
      hasConflicted[i][j] = false
    }
  }
  updateBoardView()

  score = 0
  $('#score').text(score)
  if (localStorage.getItem('highscore') == null) {
    localStorage.setItem('highscore', 0)
  }
  $('#scorehigh').text(localStorage.getItem('highscore'))
  resetScoreSize();
}

// 更新棋盘视图
function updateBoardView() {
  $('.number-cell').remove() // 删除棋盘上的旧数字方格
  for (var i = 0; i < 4; i++) {
    // 循环遍历行
    for (var j = 0; j < 4; j++) {
      // 循环遍历列
      $('#grid-container').append(
        '<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>'
      ) // 创建数字方格并添加到棋盘容器中
      var numCell = $('#number-cell-' + i + '-' + j) // 获取当前数字方格元素

      if (board[i][j] == 0) {
        // 如果方格中的数字为0
        numCell.css('width', '0px') // 设置方格宽度为0
        numCell.css('height', '0px') // 设置方格高度为0
        numCell.css('top', getPosTop(i, j) + cellSideLength * 0.5) // 设置方格上边位置
        numCell.css('left', getPosLeft(i, j) + cellSideLength * 0.5) // 设置方格左边位置
        numCell.text('') // 清空方格文字内容
      } else {
        // 如果方格中的数字不为0
        numCell.css('width', cellSideLength) // 设置方格宽度
        numCell.css('height', cellSideLength) // 设置方格高度
        numCell.css('top', getPosTop(i, j)) // 设置方格上边位置
        numCell.css('left', getPosLeft(i, j)) // 设置方格左边位置
        numCell.css('background-color', getNumBgColor(board[i][j])) // 设置方格背景颜色
        numCell.css('color', getNumberColor(board[i][j])) // 设置方格字体颜色
        numCell.text(board[i][j]) // 显示方格中的数字
        // var fontsize = 1.0 //数字大了字体要小
        // if (((board[i][j] + '').length = 3)) {
        //   fontsize = 0.8
        // } else if ((board[i][j] + '').length > 3) {
        //   fontsize = 0.6
        // }
        // numCell.css('font-size', 0.6 * fontsize * cellSideLength + 'px') // 设置方格内文字的字体大小
        numCell.css(
          'font-size',
          0.6 * getNumberSize(board[i][j]) * cellSideLength + 'px'
        ) // 设置方格内文字的字体大小
      }
      hasConflicted[i][j] = false // 初始化方格是否冲突标志为false
    }
  }
  $('.number-cell').css('line-height', cellSideLength + 'px') // 设置方格内文字的行高
  // $('.number-cell').css('font-size',0.6*cellSideLength+'px');  // 设置方格内文字的字体大小
}
// 生成一个数字函数
function generateOneNumber() {
  // 如果没有空位了
  if (nospace(board)) {
    return false
  }

  // 随机生成一个横坐标和纵坐标
  var randx = parseInt(Math.floor(Math.random() * 4))
  var randy = parseInt(Math.floor(Math.random() * 4))
  var times = 0

  // 循环找到一个空位
  while (times < 50) {
    if (board[randx][randy] == 0) break
    var randx = parseInt(Math.floor(Math.random() * 4))
    var randy = parseInt(Math.floor(Math.random() * 4))
    times++
  }

  // 如果找50次都找不到空位，就取一个已经有数字的位置
  if (times == 50) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (board[i][j] == 0) {
          randx = i
          randy = j
        }
      }
    }
  }

  // 随机生成一个数字（2或4）
  var randNumber = Math.random() < 0.5 ? 2 : 4

  // 在找到的空位上写入数字
  board[randx][randy] = randNumber

  // 在指定位置显示数字
  showNumber(randx, randy, randNumber)

  // 返回成功
  return true
}

$(document).keydown(function (event) {
  switch (event.keyCode) {
    case 37: //left
      event.preventDefault()
      if (moveLeft()) {
        setTimeout('generateOneNumber()', 210)
        setTimeout('isgameover()', 300)
      }
      break
    case 38: //up
      event.preventDefault()
      if (moveUp()) {
        setTimeout('generateOneNumber()', 210)
        setTimeout('isgameover()', 300)
      }
      break
    case 39: //right
      event.preventDefault()
      if (moveRight()) {
        setTimeout('generateOneNumber()', 210)
        setTimeout('isgameover()', 300)
      }
      break
    case 40: //down
      event.preventDefault()
      if (moveDown()) {
        setTimeout('generateOneNumber()', 210)
        setTimeout('isgameover()', 300)
      }
      break
    default:
      break
  }
})

document.addEventListener('touchstart', function (event) {
  event.preventDefault()
  startx = event.touches[0].pageX
  starty = event.touches[0].pageY
}, { passive: false })

// document.addEventListener()

document.addEventListener('touchend', function (event) {
  event.preventDefault()
  endx = event.changedTouches[0].pageX
  endy = event.changedTouches[0].pageY

  var deltax = endx - startx
  var deltay = endy - starty

  if (
    Math.abs(deltax) < 0.3 * documentWidth &&
    Math.abs(deltay) < 0.3 * documentWidth
  ) {
    return
  }
  if (Math.abs(deltax) > Math.abs(deltay)) {
    if (deltax > 0) {
      if (moveRight()) {
        setTimeout('generateOneNumber()', 210)
        setTimeout('isgameover()', 300)
      }
    } else {
      if (moveLeft()) {
        setTimeout('generateOneNumber()', 210)
        setTimeout('isgameover()', 300)
      }
    }
  } else {
    if (deltay > 0) {
      if (moveDown()) {
        setTimeout('generateOneNumber()', 210)
        setTimeout('isgameover()', 300)
      }
    } else {
      if (moveUp()) {
        setTimeout('generateOneNumber()', 210)
        setTimeout('isgameover()', 300)
      }
    }
  }
}, { passive: false })
