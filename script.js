const api_id = "${{ secrets.WEDDING_MAP_ID }}";
const api_key = "${{ secrets.WEDDING_MAP_KEY }}";

let map; // 전역 변수로 지도 객체 선언

document.addEventListener('DOMContentLoaded', function() {
    observeElement('.main-photo-img', 'show-main-photo');
    observeElement('.greetings-wrap', 'show-greetings-wrap');
    observeElement('.calendar-wrap', 'show-calendar-wrap');
    observeElement('.countdown', 'show-countdown');
    observeElement('.c-calendar', 'show-c-calendar');
    observeElement('.gallery-wrap', 'show-gallery-wrap');
    initializeSlick();
    initializeCountdown();
    wave();
    showMap();
});

function wave() {
    gsap.to("#wavePath1", {
        duration: 3,
        repeat: -1,
        yoyo: true,
        attr: {
            d: "M0,50 Q250,52 500,50 T1000,50 T1500,50 V100 H0 Z"
        },
        ease: "power1.inOut"
    });

    gsap.to("#wavePath2", {
        duration: 4,
        repeat: -1,
        yoyo: true,
        attr: {
            d: "M0,50 Q250,48 500,50 T1000,50 T1500,53 V100 H0 Z"
        },
        ease: "power1.inOut",
        delay: 1 // wave2의 애니메이션을 1초 후 시작
    });

    gsap.to("#wavePath3", {
        duration: 4,
        repeat: -1,
        yoyo: true,
        attr: {
            d: "M0,50 Q250,52 500,50 T1000,50 T1500,50 V100 H0 Z"
        },
        ease: "power1.inOut",
        delay: 2 // wave3의 애니메이션을 2초 후 시작
    });
}

function observeElement(selector, className) {
    const page = document.querySelector(selector);
    const observerOptions = {
        root: null, // 뷰포트를 root로 사용
        threshold: 0.1, // 대상의 10%가 보일 때 콜백 실행
        rootMargin: '0px' // root 마진은 0px
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 화면에 등장하는 순간 클래스를 추가합니다.
                entry.target.classList.add(className);
                // 한 번 애니메이션을 적용한 후, observer를 멈춥니다.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(page);
}


function initializeSlick() {
    const visual = $('.slick--visual');
    const progress = $('.visual__progress');
    const initPercent = 100 / ($('.slick--visual').find('.slick-slide').length);

    progress.css('background-size', initPercent + '% 100%');

    visual.slick({
        dots: true, // 네비게이션 도트 활성화
        infinite: true, // 무한 슬라이딩
        speed: 500, // 전환 속도
        slidesToShow: 1, // 한 번에 보여질 슬라이드 수
        adaptiveHeight: false,
        centerMode: true,
        autoplay: true,
        autoplaySpeed: 5000,
        centerPadding: '0px',

        appendDots: '.slick--visual__paging',
        customPaging: function (slider, i) {
            return  '<span>'+(i + 1)+'</span><span>/</span><span>' + slider.slideCount + '</span>';
                }
    });

    visual.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        var calc = ((nextSlide + 1) / slick.slideCount) * 100;
        progress
          .css('background-size', calc + '% 100%')
          .attr('aria-valuenow', calc);
      });
}

var prevDday = null;
var prevDhour = null;
var prevDminutes = null;
var prevDseconds = null;
function initializeCountdown() {
    var targetDate = new Date(2024, 8, 21, 12, 00); // 월은 0부터 시작합니다. 11월은 10입니다.
    
    countdown(function() {
        var currentDate = new Date()

        var timeDiff = targetDate.getTime() - currentDate.getTime();
        var seconds = Math.floor(timeDiff / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);

        var daysElement = document.getElementById('days');
        var ddaysElement = document.getElementById('ddays');
        var hoursElement = document.getElementById('hours');
        var minutesElement = document.getElementById('minutes');
        var secondsElement = document.getElementById('seconds');

        if (prevDday !== days) {
            prevDday = days;
            ddaysElement.innerText = days + '일'; // dday 업데이트
            daysElement.innerText = days;
        }
        if (prevDhour !== hours) {
            prevDhour = hours;
            hoursElement.innerText = hours % 24;
        }
        if (prevDminutes !== minutes) {
            prevDminutes = minutes;
            minutesElement.innerText = minutes % 60;
        }
        if (prevDseconds !== seconds) {
            prevDseconds = seconds;
            secondsElement.innerText = seconds % 60;
        } 
    }, 1000);
}

(function(d) {
    var config = {
      kitId: 'myx0srb',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);


function showMap() {
    const lat = 37.3400457;
    const lng = 127.1069711;

    const mapOptions = {
        center: new naver.maps.LatLng(lat, lng),
        draggable: true,
        pinchZoom: true, // 핀치 줌 비활성화 (모바일)
        scrollWheel: true, // 마우스 스크롤 비활성화
        zoomControl: true, // 확대/축소 버튼 활성화
        zoom: 15, // 원하는 줌 레벨
        zoomControlOptions: {
            position: naver.maps.Position.LEFT_BOTTOM // 확대/축소 버튼 위치 설정
        }
    };
    // 지도 객체 생성
    map = new naver.maps.Map('map', mapOptions);

    // 회사 마커와 레이블 추가
    const companyPosition = new naver.maps.LatLng(37.3400457, 127.1069711);
    createLabel(map, companyPosition, '<div>분당앤스퀘어</div>', 'company-label');
    // 지도 객체 반환
    return map;
}

function updateLabelPosition(map, labelDiv, position) {
    const projection = map.getProjection();
    const positionTopLeft = projection.fromCoordToOffset(position);
    labelDiv.style.left = `${positionTopLeft.x}px`;
    labelDiv.style.top = `${positionTopLeft.y}px`;
}

function createLabel(map, position, content, cssClass) {
    const labelDiv = document.createElement('div');
    labelDiv.className = `custom-label ${cssClass}`;
    labelDiv.innerHTML = content;

    // 지도 줌 레벨 변경 시 레이블 위치 업데이트
    naver.maps.Event.addListener(map, 'zoom_changed', () => {
        updateLabelPosition(map, labelDiv, position);
    });

    // 초기 레이블 위치 설정
    updateLabelPosition(map, labelDiv, position);

    // 지도에 레이블 추가
    map.getPanes().floatPane.appendChild(labelDiv);

    return labelDiv;
}






