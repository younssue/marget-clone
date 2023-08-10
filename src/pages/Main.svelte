<script>
  import { onMount } from "svelte";
  import Footer from "../components/Footer.svelte";
  import { getDatabase, ref, onValue } from "firebase/database";

  let hour = new Date().getHours();
  let min = new Date().getMinutes();
  // 반응형 렌더링
  $: items = [];

  const db = getDatabase();
  const itemsRef = ref(db, "items/");

  //onMount: 글을 쓰고 돌아와도 다시 함수를 reload시킨다
  onMount(() => {
    //데이터를 서버쪽에서 바꿔도 바로바로 업데이트가능
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      items = Object.values(data).reverse();
    });
  });

  //작성 시간
  const calcTime = (timestamp) => {
    //한국시간 UTC +9
    const curTime = new Date().getTime() - 9 * 60 * 60 * 1000;
    //몇분전, 몇초전 이렇게 현재시간에서 작성된 시간을 뺸 값:time
    const time = new Date(curTime - timestamp);
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();

    if (hour > 0) return `${hour}시간 전`;
    else if (minute > 0) return `${minute}분 전`;
    else if (second >= 0) return `${second}초 전`;
    else return "방금 전";
  };
</script>

<header>
  <div class="info-bar">
    <div class="info-bar__time">{hour}:{min}</div>
    <div class="info-bar__icons">
      <img src="assets/chart-bar.svg" alt="chart-bar" />
      <img src="assets/wifi.svg" alt="wifi" />
      <img src="assets/battery.svg" alt="battery" />
    </div>
  </div>
  <div class="menu-bar">
    <div class="menu-bar__location">
      <div>역삼1동</div>
      <div class="menu-bar__location-icon">
        <img src="assets/arrow-down.svg" alt="arrow-down" />
      </div>
    </div>
    <div class="menu-bar__icons">
      <img src="assets/search.svg" alt="search" />
      <img src="assets/menu.svg" alt="arrow-down" />
      <img src="assets/alert.svg" alt="arrow-down" />
    </div>
  </div>
</header>

<main>
  {#each items as item}
    <div class="item-list">
      <div class="item-list__img">
        <img src={item.imgUrl} alt={item.title} />
      </div>
      <div class="item-list__info">
        <div class="item-list__info-title">{item.title}</div>
        <div class="item-list__info-meta">
          {item.place}
          {calcTime(item.insertAt)}
        </div>
        <div class="item-list__info-price">{item.price}</div>
        <div class="item-list__info-description">{item.description}</div>
      </div>
    </div>
  {/each}
  <a class="write-btn" href="#/write">+ 글쓰기</a>
</main>
<Footer location="home" />
<div class="media-info-msg">화면 사이즈를 줄여주세요</div>
