/* 페이지: 보드(index.html)   만든 사람: 이름(GitHub 아이디)
   맡은 기능: 필수 1 실시간 목록, 2 요청을 바꾸는 검색, 3 정렬 2가지, 5 찜과 찜 모두 지우기
   수업 밖 문법: 없음(있으면 그 줄 위에 // 출처: 주석)
   생성형 AI 사용 기록: 없음 / 있으면 README.md의 생성형 AI 사용 내역에
   출처: 교수 참고 보드 web-fa(https://github.com/martin-yeo/web-fa). 실습과제 #3 정답 예시를 STARTER.md 7절 '바꿔야 하는 4 곳'대로 재사용한 것. 이 줄은 지우지 않습니다 */

// board.js : 실습과제 #3의 renderCards, getView, 찜 코드를 스타터의 보드로 옮긴 것입니다.
// 고친 줄에는 "바꿀 곳 1~4" 주석을 달았고, 나머지는 #3 그대로이거나 스타터 카드의 규칙(평점 없음, 개봉일 미정)입니다.

// ===== 실습과제 #2에서 가져온 함수(그대로) =====
// posterUrl은 common.js에 같은 함수가 있어 옮기지 않았습니다(옮겨도 같은 함수라 문제없음).

// sortBy : 배열, 키 이름, 내림차순 여부 ⇒ 정렬한 새 배열(원본 그대로)
function sortBy(list, key, desc) {
  const copy = [...list];
  copy.sort((a, b) => {
    if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
    return a[key] - b[key];
  });
  if (desc) copy.reverse();
  return copy;
}

// search : 배열, 검색어 ⇒ 제목에 검색어가 든 새 배열(대소문자, 앞뒤 공백 무시)
function search(list, keyword) {
  const k = keyword.trim().toLowerCase();
  return list.filter(m => m.title.toLowerCase().includes(k));
}

// ===== 데이터와 찜 =====
let movies = [];                  // 바꿀 곳 1: data.js의 movies 대신, 불러온 뒤 data.results.map(toMovie)로 채움
const liked = loadLiked();        // 바꿀 곳 2: "liked" 대신 common.js의 loadLiked, saveLiked(키 final-liked)

const board = document.querySelector(".board");

// posterHTML : 영화, 크기 ⇒ <img> 또는 대체 표지(실습과제 #1의 .poster-fallback) HTML
function posterHTML(m, size) {
  if (m.poster === null) return `<div class="poster-fallback">${escapeHTML(m.title[0])}</div>`;
  return `<img class="poster" src="${posterUrl(m.poster, size)}" alt="${escapeHTML(m.title)} 포스터">`;
}

// renderCards : 영화 배열 ⇒ 보드에 카드 생성(반환값 없음)
function renderCards(list) {
  board.innerHTML = "";
  for (const m of list) {
    const card = document.createElement("article");
    card.className = "card";
    if (m.rating >= 8) card.classList.add("hot");
    if (m.poster === null) card.classList.add("no-poster");
    card.setAttribute("data-type", m.type);
    card.setAttribute("data-id", m.id);              // 바꿀 곳 3: data-title 대신 data-id
    // #3의 순위 배지(.rank)는 뺐습니다: TMDB 목록에는 순위가 없음
    let heart = "like";
    if (liked.includes(m.id)) heart = "like liked";  // 바꿀 곳 3: 제목 대신 id로 찜 확인
    // 평가가 하나도 없는 영화(평점 0)는 숫자 대신 "평점 없음"(스타터 카드와 같은 규칙)
    let rating = "평점 없음";
    if (m.rating > 0) rating = m.rating.toFixed(1);
    // 제목은 외부 데이터라 escapeHTML로 감싸고, 개봉일이 없는 영화(연도 0)는 "개봉일 미정"
    card.innerHTML = `
      ${posterHTML(m, "w342")}
      <span class="badge">${rating}</span>
      <div class="info">
        <h3>${escapeHTML(m.title)}</h3>
        <p class="year">${m.year || "개봉일 미정"}</p>
        <button class="${heart}" type="button">♥</button>
      </div>`;
    board.appendChild(card);
  }
  document.getElementById("count").textContent = list.length + "편";
  document.getElementById("likeCount").textContent = liked.length;
  // 빈 결과: #3의 .state-empty 대신 스타터의 setState(상태 3종의 빈 결과 문구)
  if (list.length === 0) setState(board, "empty", "조건에 맞는 영화가 없습니다.");
  else setState(board, "done", "");
}

// getView : 없음 ⇒ 검색 ⇒ 정렬 순서로 만든 새 배열(#3의 보기 필터 줄은 뺌: TMDB 영화는 모두 같은 종류)
function getView() {
  const keyword = document.getElementById("q").value;
  const key = document.getElementById("sort").value;
  const list = search(movies, keyword);
  return sortBy(list, key, key !== "title");
}
// refresh : 없음 ⇒ 지금 조건으로 다시 그리기(그대로)
function refresh() {
  renderCards(getView());
}
// toggleLike : 영화 id ⇒ 찜 배열에 넣거나 빼고 저장한 뒤 다시 그리기
function toggleLike(id) {                          // 바꿀 곳 3: 제목 대신 id
  const i = liked.indexOf(id);
  if (i === -1) liked.push(id);
  else liked.splice(i, 1);
  saveLiked(liked);                                // 바꿀 곳 2: common.js의 saveLiked(키 final-liked)
  refresh();
}
// 바꿀 곳 4: openDetail(<dialog>)은 옮기지 않고 아래 클릭 리스너에서 detail.html?id=영화번호로 이동.
// 그리기 코드는 detail.js로 옮겼습니다.

// ===== 불러오기(스타터의 기본형을 #3 구조에 맞게) =====
async function loadNowPlaying() {
  setState(board, "loading", "영화 목록을 불러오는 중입니다.");
  try {
    const data = await fetchJSON(tmdbUrl("movie/now_playing", { region: "KR" }));
    setState(board, "done", "");
    movies = data.results.map(toMovie);            // 바꿀 곳 1
    refresh();
  } catch (err) {
    setState(board, "error", "목록을 불러오지 못했습니다(" + err.message + ")");
  }
}

// ===== 이벤트 : 렌더 함수 밖에서 한 번씩만(그대로) =====
document.getElementById("q").addEventListener("input", refresh);
document.getElementById("sort").addEventListener("change", refresh);
board.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const id = Number(card.getAttribute("data-id"));  // 바꿀 곳 3: 속성값(문자열)을 Number()로
  if (e.target.closest(".like")) {
    toggleLike(id);
    return;
  }
  let url = "detail.html?id=" + id;                 // 바꿀 곳 4
  if (getParam("sample") === "1") url += "&sample=1";   // ?sample=1로 연 보드면 상세도 샘플 모드로
  location.href = url;
});

// ===== 여기부터 내 몫(교수 참고 보드에는 코드가 없습니다) =====
// TODO 필수 2: 검색창에서 Enter를 치면 검색어로 search/movie를 불러와 movies를 바꾸고 다시 그리기
// TODO 필수 5: index.html에 만든 찜 모두 지우기 버튼을 누르면 찜 배열을 비우고 저장한 뒤 다시 그리기

loadNowPlaying();
