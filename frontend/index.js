// 글 작성 시간 표시

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

//div 값을 js에서 설정
//글 목록 div에 넣어서 불러오기
const renderData = (data) => {
  const main = document.querySelector("main");
  //[].reverse(): ["a","b","c"] -> ["c","b","a"]
  // data는 배열 식으로 오니까  forEach를 통해 각각의 배열을 돌면서 해당값을 가져옴
  //그런데 reverse()를 사용하니 배열값이 뒤집어지게만 나올 뿐 시간 순서가 맞지 않게 됨
  //그래서 sort()활용 -> 나중에 심화로 배워본다함

  console.log(data);
  data.reverse().forEach(async (obj) => {
    const div = document.createElement("div");
    div.className = "item-list";

    const imgDiv = document.createElement("div");
    imgDiv.className = "item-list__img";

    const InfoDiv = document.createElement("div");
    InfoDiv.className = "item-list__info";

    const img = document.createElement("img");
    const res = await fetch(`/images/${obj.id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    img.src = url;
    //img.src = "assets/img.svg";
    //img.src = obj.image;

    const InfoTitleDiv = document.createElement("div");
    InfoTitleDiv.className = "item-list__info-title";
    InfoTitleDiv.innerText = obj.title;

    const InfoMetaDiv = document.createElement("div");
    InfoMetaDiv.className = "item-list__info-meta";
    InfoMetaDiv.innerText = obj.place + "  " + calcTime(obj.insertAt);

    const InfoPriceDiv = document.createElement("div");
    InfoPriceDiv.className = "item-list__info-price";
    InfoPriceDiv.innerText = obj.price;

    imgDiv.appendChild(img);

    InfoDiv.appendChild(InfoTitleDiv);
    InfoDiv.appendChild(InfoMetaDiv);
    InfoDiv.appendChild(InfoPriceDiv);
    div.appendChild(imgDiv);
    div.appendChild(InfoDiv);
    //const div = document.createElement("div");
    //div.innerText = obj.title;
    main.appendChild(div);
  });
};

//글 목록 불러오기

const fetchList = async () => {
  const access_token = window.localStorage.getItem("token");

  const res = await fetch("/items", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (res.status === 401) {
    alert("로그인이 필요합니다");
    window.location.pathname = "/login.html";
    return;
  }

  const data = await res.json();
  renderData(data);
};

// item 리스트 호출
fetchList();
