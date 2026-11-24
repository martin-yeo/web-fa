/* 페이지: 상세(detail.html)   만든 사람: 이름(GitHub 아이디)
   맡은 기능: 필수 4 상세(두 번째 호출, 목록에 없던 정보 2개)
   수업 밖 문법: 없음(있으면 그 줄 위에 // 출처: 주석)
   생성형 AI 사용 기록: 없음 / 있으면 README.md의 생성형 AI 사용 내역에
   출처: 교수 참고 보드 web-fa(https://github.com/martin-yeo/web-fa). 실습과제 #3 정답 예시를 STARTER.md 7절 '바꿔야 하는 4 곳'대로 재사용한 것. 이 줄은 지우지 않습니다 */

// detail.js : 주소의 id로 영화 한 편 불러오기(두 번째 호출, board.js의 기본형과 같은 짜임)
async function loadDetail() {
  const detail = document.getElementById("detail");
  const id = getParam("id");   // detail.html?id=영화번호 의 번호(글자)
  if (!id) {
    setState(detail, "error", "영화 번호가 없습니다(보드에서 카드를 눌러 들어오세요)");
    return;
  }
  setState(detail, "loading", "영화 정보를 불러오는 중입니다.");
  try {
    const data = await fetchJSON(tmdbUrl("movie/" + id));
    setState(detail, "done", "");
    const movie = toMovie(data);   // #3 영화 객체 모양(title, poster, rating, overview 등)
    document.title = movie.title;  // 브라우저 탭 제목
    // 바꿀 곳 4: #3 openDetail의 그리기(포스터 w500, 제목, 개봉일, 평점, 줄거리)를 movie/{id} 응답으로 채움
    // 포스터가 없으면 대체 표지(제목 첫 글자)
    let poster = `<div class="poster-fallback">${escapeHTML(movie.title[0])}</div>`;
    if (movie.poster !== null) {
      poster = `<img class="poster" src="${posterUrl(movie.poster, "w500")}" alt="${escapeHTML(movie.title)} 포스터">`;
    }
    // 개봉일이 없으면 "개봉일 미정", 평점 0이면 "평점 없음"(보드 카드와 같은 규칙)
    let date = "개봉일 미정";
    if (movie.date !== "") date = "개봉일 " + movie.date;
    let rating = "평점 없음";
    if (movie.rating > 0) rating = "평점 " + movie.rating.toFixed(1);
    // 줄거리가 비면 toMovie가 "줄거리 정보가 없습니다."를 넣어 줍니다
    detail.innerHTML = `
      ${poster}
      <div class="info">
        <h1>${escapeHTML(movie.title)}</h1>
        <p class="meta">${escapeHTML(date)}, ${rating}</p>
        <p>${escapeHTML(movie.overview)}</p>
      </div>`;
    // TODO 필수 4: 목록에 없던 정보 2개 이상을 여기에 더하기(장르 data.genres, 상영시간 data.runtime 등)
  } catch (err) {
    setState(detail, "error", "영화 정보를 불러오지 못했습니다(" + err.message + ")");
  }
}
loadDetail();
