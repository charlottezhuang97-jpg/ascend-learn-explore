(() => {
  const course = new URLSearchParams(location.search).get('course');
  if (course !== 'operator') return;
  const lessonTitle = document.querySelector('.fixed1030-lesson #lessonTitle') || document.getElementById('lessonTitle');
  if (lessonTitle) lessonTitle.textContent = 'Ascend C 算子开发基础';
  const videoTitle = document.getElementById('videoLessonTitle');
  if (videoTitle) videoTitle.textContent = 'Ascend C 算子开发基础';
  const videoFrame = document.querySelector('.video-workspace .video-stage img');
  if (videoFrame) {
    videoFrame.src = 'assets/images/immersive-learning/ascend-c-subtitle-frame.webp';
    videoFrame.alt = 'Ascend C 算子开发课程视频画面：算子的数学含义';
  }
  document.title = 'Ascend C 算子开发基础 · 沉浸式学习';
})();
