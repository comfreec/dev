// 게임 상태 관리
let gameState = {
    score: 0,
    level: 1,
    currentConsonant: 'ㄱ',
    currentVowel: 'ㅏ',
    selectedConsonant: '',
    selectedVowel: '',
    currentWordIndex: 0,
    starsEarned: 0
};

// 캔버스 전역 변수들
let guideCanvas, guideCtx;
let writingCanvas, writingCtx;
let vowelGuideCanvas, vowelGuideCtx;
let vowelCanvas, vowelCtx;

// 자음 배열
const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 모음 배열
const vowels = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];

// 한글 자모 획순 데이터베이스
const strokeData = {
    // 자음 획순 데이터
    consonants: {
        'ㄱ': {
            strokes: [
                { path: [[60, 50], [60, 150]], order: 1, direction: '위에서 아래로' },
                { path: [[60, 100], [140, 100]], order: 2, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '기역',
            pronunciation: '기역',
            english: 'Giyeok'
        },
        'ㄴ': {
            strokes: [
                { path: [[60, 50], [60, 150]], order: 1, direction: '위에서 아래로' },
                { path: [[60, 150], [140, 150]], order: 2, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '니은',
            pronunciation: '니은',
            english: 'Nieun'
        },
        'ㄷ': {
            strokes: [
                { path: [[60, 50], [140, 50]], order: 1, direction: '왼쪽에서 오른쪽으로' },
                { path: [[60, 50], [60, 150]], order: 2, direction: '위에서 아래로' },
                { path: [[60, 150], [140, 150]], order: 3, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '디귿',
            pronunciation: '디귿',
            english: 'Digeut'
        },
        'ㄹ': {
            strokes: [
                { path: [[60, 50], [140, 50]], order: 1, direction: '왼쪽에서 오른쪽으로' },
                { path: [[60, 50], [60, 100]], order: 2, direction: '위에서 아래로' },
                { path: [[60, 100], [100, 100]], order: 3, direction: '왼쪽에서 오른쪽으로' },
                { path: [[100, 100], [100, 150]], order: 4, direction: '위에서 아래로' },
                { path: [[100, 150], [140, 150]], order: 5, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '리을',
            pronunciation: '리을',
            english: 'Rieul'
        },
        'ㅁ': {
            strokes: [
                { path: [[60, 50], [140, 50]], order: 1, direction: '왼쪽에서 오른쪽으로' },
                { path: [[60, 50], [60, 150]], order: 2, direction: '위에서 아래로' },
                { path: [[140, 50], [140, 150]], order: 3, direction: '위에서 아래로' },
                { path: [[60, 150], [140, 150]], order: 4, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '미음',
            pronunciation: '미음',
            english: 'Mieum'
        },
        'ㅂ': {
            strokes: [
                { path: [[60, 50], [60, 150]], order: 1, direction: '위에서 아래로' },
                { path: [[140, 50], [140, 150]], order: 2, direction: '위에서 아래로' },
                { path: [[60, 100], [140, 100]], order: 3, direction: '왼쪽에서 오른쪽으로' },
                { path: [[60, 150], [140, 150]], order: 4, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '비읍',
            pronunciation: '비읍',
            english: 'Bieup'
        },
        'ㅅ': {
            strokes: [
                { path: [[80, 50], [60, 100]], order: 1, direction: '위에서 아래로' },
                { path: [[120, 50], [140, 100]], order: 2, direction: '위에서 아래로' }
            ],
            description: '시옷',
            pronunciation: '시옷',
            english: 'Siot'
        },
        'ㅇ': {
            strokes: [
                { path: [[100, 50], [140, 75], [140, 125], [100, 150], [60, 125], [60, 75], [100, 50]], order: 1, direction: '시계 방향으로' }
            ],
            description: '이응',
            pronunciation: '이응'
        },
        'ㅈ': {
            strokes: [
                { path: [[80, 30], [60, 70]], order: 1, direction: '위에서 아래로' },
                { path: [[120, 30], [140, 70]], order: 2, direction: '위에서 아래로' },
                { path: [[60, 70], [140, 70]], order: 3, direction: '왼쪽에서 오른쪽으로' },
                { path: [[100, 70], [100, 130]], order: 4, direction: '위에서 아래로' }
            ],
            description: '지읒',
            pronunciation: '지읒',
            english: 'Jieut'
        },
        'ㅊ': {
            strokes: [
                { path: [[80, 20], [60, 60]], order: 1, direction: '위에서 아래로' },
                { path: [[120, 20], [140, 60]], order: 2, direction: '위에서 아래로' },
                { path: [[80, 40], [60, 80]], order: 3, direction: '위에서 아래로' },
                { path: [[120, 40], [140, 80]], order: 4, direction: '위에서 아래로' },
                { path: [[60, 80], [140, 80]], order: 5, direction: '왼쪽에서 오른쪽으로' },
                { path: [[100, 80], [100, 140]], order: 6, direction: '위에서 아래로' }
            ],
            description: '치읓',
            pronunciation: '치읓',
            english: 'Chieut'
        },
        'ㅋ': {
            strokes: [
                { path: [[60, 50], [60, 150]], order: 1, direction: '위에서 아래로' },
                { path: [[60, 80], [120, 80]], order: 2, direction: '왼쪽에서 오른쪽으로' },
                { path: [[60, 120], [120, 120]], order: 3, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '키읔',
            pronunciation: '키읔',
            english: 'Kieuk'
        },
        'ㅌ': {
            strokes: [
                { path: [[60, 50], [140, 50]], order: 1, direction: '왼쪽에서 오른쪽으로' },
                { path: [[100, 30], [100, 70]], order: 2, direction: '위에서 아래로' },
                { path: [[60, 70], [60, 150]], order: 3, direction: '위에서 아래로' },
                { path: [[60, 150], [140, 150]], order: 4, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '티읕',
            pronunciation: '티읕',
            english: 'Tieut'
        },
        'ㅍ': {
            strokes: [
                { path: [[60, 50], [140, 50]], order: 1, direction: '왼쪽에서 오른쪽으로' },
                { path: [[60, 50], [60, 150]], order: 2, direction: '위에서 아래로' },
                { path: [[140, 50], [140, 150]], order: 3, direction: '위에서 아래로' },
                { path: [[60, 100], [140, 100]], order: 4, direction: '왼쪽에서 오른쪽으로' },
                { path: [[60, 150], [140, 150]], order: 5, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '피읖',
            pronunciation: '피읖',
            english: 'Pieup'
        },
        'ㅎ': {
            strokes: [
                { path: [[60, 50], [60, 130]], order: 1, direction: '위에서 아래로' },
                { path: [[140, 50], [140, 130]], order: 2, direction: '위에서 아래로' },
                { path: [[60, 90], [140, 90]], order: 3, direction: '왼쪽에서 오른쪽으로' },
                { path: [[100, 90], [100, 150]], order: 4, direction: '위에서 아래로' }
            ],
            description: '히읗',
            pronunciation: '히읗',
            english: 'Hieuh'
        }
    },
    // 모음 획순 데이터
    vowels: {
        'ㅏ': {
            strokes: [
                { path: [[100, 50], [100, 150]], order: 1, direction: '위에서 아래로' },
                { path: [[100, 100], [140, 100]], order: 2, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '아',
            pronunciation: '아'
        },
        'ㅑ': {
            strokes: [
                { path: [[100, 50], [100, 150]], order: 1, direction: '위에서 아래로' },
                { path: [[100, 80], [140, 80]], order: 2, direction: '왼쪽에서 오른쪽으로' },
                { path: [[100, 120], [140, 120]], order: 3, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '야',
            pronunciation: '야'
        },
        'ㅓ': {
            strokes: [
                { path: [[100, 50], [100, 150]], order: 1, direction: '위에서 아래로' },
                { path: [[60, 100], [100, 100]], order: 2, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '어',
            pronunciation: '어'
        },
        'ㅕ': {
            strokes: [
                { path: [[100, 50], [100, 150]], order: 1, direction: '위에서 아래로' },
                { path: [[60, 80], [100, 80]], order: 2, direction: '왼쪽에서 오른쪽으로' },
                { path: [[60, 120], [100, 120]], order: 3, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '여',
            pronunciation: '여'
        },
        'ㅗ': {
            strokes: [
                { path: [[60, 100], [140, 100]], order: 1, direction: '왼쪽에서 오른쪽으로' },
                { path: [[100, 100], [100, 60]], order: 2, direction: '아래에서 위로' }
            ],
            description: '오',
            pronunciation: '오',
            english: 'O'
        },
        'ㅛ': {
            strokes: [
                { path: [[60, 100], [140, 100]], order: 1, direction: '왼쪽에서 오른쪽으로' },
                { path: [[80, 100], [80, 60]], order: 2, direction: '아래에서 위로' },
                { path: [[120, 100], [120, 60]], order: 3, direction: '아래에서 위로' }
            ],
            description: '요',
            pronunciation: '요',
            english: 'Yo'
        },
        'ㅜ': {
            strokes: [
                { path: [[60, 100], [140, 100]], order: 1, direction: '왼쪽에서 오른쪽으로' },
                { path: [[100, 100], [100, 140]], order: 2, direction: '위에서 아래로' }
            ],
            description: '우',
            pronunciation: '우',
            english: 'U'
        },
        'ㅠ': {
            strokes: [
                { path: [[60, 100], [140, 100]], order: 1, direction: '왼쪽에서 오른쪽으로' },
                { path: [[80, 100], [80, 140]], order: 2, direction: '위에서 아래로' },
                { path: [[120, 100], [120, 140]], order: 3, direction: '위에서 아래로' }
            ],
            description: '유',
            pronunciation: '유',
            english: 'Yu'
        },
        'ㅡ': {
            strokes: [
                { path: [[60, 100], [140, 100]], order: 1, direction: '왼쪽에서 오른쪽으로' }
            ],
            description: '으',
            pronunciation: '으',
            english: 'Eu'
        },
        'ㅣ': {
            strokes: [
                { path: [[100, 50], [100, 150]], order: 1, direction: '위에서 아래로' }
            ],
            description: '이',
            pronunciation: '이',
            english: 'I'
        }
    }
};

// 단어 게임 데이터 (100개 이상의 다양한 예제)
const wordGames = [
    // 교통수단
    { image: '🚗', word: '자동차', options: ['자동차', '비행기', '기차'] },
    { image: '🚂', word: '기차', options: ['기차', '자동차', '배'] },
    { image: '✈️', word: '비행기', options: ['비행기', '헬기', '우주선'] },
    { image: '🚁', word: '헬기', options: ['헬기', '비행기', '드론'] },
    { image: '🚢', word: '배', options: ['배', '잠수함', '요트'] },
    { image: '🚌', word: '버스', options: ['버스', '택시', '트럭'] },
    { image: '🚕', word: '택시', options: ['택시', '버스', '승용차'] },
    { image: '🚲', word: '자전거', options: ['자전거', '오토바이', '킥보드'] },
    { image: '🛴', word: '킥보드', options: ['킥보드', '자전거', '스케이트'] },
    { image: '🚀', word: '로켓', options: ['로켓', '비행기', '우주선'] },
    
    // 동물들
    { image: '🐶', word: '강아지', options: ['강아지', '고양이', '토끼'] },
    { image: '🐱', word: '고양이', options: ['고양이', '강아지', '햄스터'] },
    { image: '🐰', word: '토끼', options: ['토끼', '햄스터', '다람쥐'] },
    { image: '🐭', word: '쥐', options: ['쥐', '햄스터', '토끼'] },
    { image: '🐹', word: '햄스터', options: ['햄스터', '쥐', '토끼'] },
    { image: '🐻', word: '곰', options: ['곰', '호랑이', '사자'] },
    { image: '🦁', word: '사자', options: ['사자', '호랑이', '표범'] },
    { image: '🐯', word: '호랑이', options: ['호랑이', '사자', '표범'] },
    { image: '🐸', word: '개구리', options: ['개구리', '두꺼비', '도마뱀'] },
    { image: '🐵', word: '원숭이', options: ['원숭이', '고릴라', '침팬지'] },
    { image: '🐘', word: '코끼리', options: ['코끼리', '하마', '코뿔소'] },
    { image: '🦒', word: '기린', options: ['기린', '얼룩말', '코끼리'] },
    { image: '🐧', word: '펭귄', options: ['펭귄', '오리', '백조'] },
    { image: '🦆', word: '오리', options: ['오리', '펭귄', '백조'] },
    { image: '🐔', word: '닭', options: ['닭', '오리', '거위'] },
    { image: '🐟', word: '물고기', options: ['물고기', '상어', '고래'] },
    { image: '🐙', word: '문어', options: ['문어', '오징어', '해파리'] },
    { image: '🦋', word: '나비', options: ['나비', '벌', '잠자리'] },
    { image: '🐝', word: '벌', options: ['벌', '나비', '파리'] },
    { image: '🐞', word: '무당벌레', options: ['무당벌레', '거미', '개미'] },
    
    // 음식들
    { image: '🍎', word: '사과', options: ['사과', '바나나', '딸기'] },
    { image: '🍌', word: '바나나', options: ['바나나', '사과', '오렌지'] },
    { image: '🍓', word: '딸기', options: ['딸기', '체리', '포도'] },
    { image: '🍊', word: '오렌지', options: ['오렌지', '귤', '레몬'] },
    { image: '🍇', word: '포도', options: ['포도', '딸기', '체리'] },
    { image: '🍑', word: '체리', options: ['체리', '딸기', '포도'] },
    { image: '🥕', word: '당근', options: ['당근', '무', '양파'] },
    { image: '🌶️', word: '고추', options: ['고추', '당근', '오이'] },
    { image: '🥒', word: '오이', options: ['오이', '호박', '가지'] },
    { image: '🍅', word: '토마토', options: ['토마토', '사과', '고추'] },
    { image: '🍞', word: '빵', options: ['빵', '떡', '과자'] },
    { image: '🍰', word: '케이크', options: ['케이크', '빵', '쿠키'] },
    { image: '🍪', word: '쿠키', options: ['쿠키', '과자', '케이크'] },
    { image: '🍭', word: '사탕', options: ['사탕', '초콜릿', '젤리'] },
    { image: '🍫', word: '초콜릿', options: ['초콜릿', '사탕', '쿠키'] },
    { image: '🍨', word: '아이스크림', options: ['아이스크림', '빙수', '셔벗'] },
    { image: '🥛', word: '우유', options: ['우유', '주스', '물'] },
    { image: '🧃', word: '주스', options: ['주스', '우유', '물'] },
    
    // 스포츠/놀이
    { image: '⚽', word: '축구공', options: ['축구공', '농구공', '야구공'] },
    { image: '🏀', word: '농구공', options: ['농구공', '축구공', '배구공'] },
    { image: '⚾', word: '야구공', options: ['야구공', '테니스공', '탁구공'] },
    { image: '🏐', word: '배구공', options: ['배구공', '농구공', '축구공'] },
    { image: '🎾', word: '테니스공', options: ['테니스공', '야구공', '탁구공'] },
    { image: '🏓', word: '탁구', options: ['탁구', '테니스', '배드민턴'] },
    { image: '🎯', word: '다트', options: ['다트', '활', '총'] },
    { image: '🎮', word: '게임기', options: ['게임기', '컴퓨터', '핸드폰'] },
    { image: '🧸', word: '곰인형', options: ['곰인형', '로봇', '인형'] },
    { image: '🎲', word: '주사위', options: ['주사위', '블록', '퍼즐'] },
    
    // 학용품/생활용품
    { image: '📚', word: '책', options: ['책', '연필', '지우개'] },
    { image: '✏️', word: '연필', options: ['연필', '볼펜', '크레용'] },
    { image: '✂️', word: '가위', options: ['가위', '칼', '자'] },
    { image: '📏', word: '자', options: ['자', '가위', '연필'] },
    { image: '🖍️', word: '크레용', options: ['크레용', '색연필', '마커'] },
    { image: '🎒', word: '가방', options: ['가방', '상자', '바구니'] },
    { image: '👕', word: '셔츠', options: ['셔츠', '바지', '치마'] },
    { image: '👖', word: '바지', options: ['바지', '셔츠', '양말'] },
    { image: '👟', word: '신발', options: ['신발', '양말', '모자'] },
    { image: '🧦', word: '양말', options: ['양말', '신발', '장갑'] },
    { image: '🧢', word: '모자', options: ['모자', '안경', '목도리'] },
    { image: '👓', word: '안경', options: ['안경', '모자', '시계'] },
    { image: '⌚', word: '시계', options: ['시계', '반지', '목걸이'] },
    
    // 건물/장소
    { image: '🏠', word: '집', options: ['집', '학교', '병원'] },
    { image: '🏫', word: '학교', options: ['학교', '병원', '도서관'] },
    { image: '🏥', word: '병원', options: ['병원', '약국', '학교'] },
    { image: '💒', word: '교회', options: ['교회', '절', '성당'] },
    { image: '🏪', word: '상점', options: ['상점', '마트', '시장'] },
    { image: '🏢', word: '빌딩', options: ['빌딩', '아파트', '집'] },
    { image: '🏛️', word: '박물관', options: ['박물관', '도서관', '미술관'] },
    { image: '🏟️', word: '경기장', options: ['경기장', '운동장', '체육관'] },
    { image: '🎢', word: '놀이공원', options: ['놀이공원', '공원', '동물원'] },
    { image: '🎡', word: '관람차', options: ['관람차', '롤러코스터', '회전목마'] },
    
    // 자연/날씨
    { image: '🌞', word: '해', options: ['해', '달', '별'] },
    { image: '🌙', word: '달', options: ['달', '해', '별'] },
    { image: '⭐', word: '별', options: ['별', '달', '해'] },
    { image: '☁️', word: '구름', options: ['구름', '비', '눈'] },
    { image: '🌧️', word: '비', options: ['비', '눈', '바람'] },
    { image: '❄️', word: '눈', options: ['눈', '비', '얼음'] },
    { image: '🌸', word: '꽃', options: ['꽃', '나무', '잎'] },
    { image: '🌳', word: '나무', options: ['나무', '꽃', '풀'] },
    { image: '🍃', word: '잎', options: ['잎', '꽃', '풀'] },
    { image: '🌊', word: '바다', options: ['바다', '강', '호수'] },
    { image: '⛰️', word: '산', options: ['산', '언덕', '바위'] },
    { image: '🔥', word: '불', options: ['불', '물', '흙'] },
    
    // 악기/음악
    { image: '🎵', word: '음악', options: ['음악', '노래', '소리'] },
    { image: '🎤', word: '마이크', options: ['마이크', '스피커', '라디오'] },
    { image: '🎸', word: '기타', options: ['기타', '피아노', '바이올린'] },
    { image: '🎹', word: '피아노', options: ['피아노', '기타', '드럼'] },
    { image: '🥁', word: '드럼', options: ['드럼', '피아노', '기타'] },
    { image: '🎺', word: '트럼펫', options: ['트럼펫', '색소폰', '플루트'] },
    
    // 도구/기계
    { image: '💻', word: '컴퓨터', options: ['컴퓨터', '노트북', '태블릿'] },
    { image: '📱', word: '핸드폰', options: ['핸드폰', '컴퓨터', '태블릿'] },
    { image: '📺', word: '텔레비전', options: ['텔레비전', '모니터', '라디오'] },
    { image: '🔧', word: '렌치', options: ['렌치', '드라이버', '망치'] },
    { image: '🔨', word: '망치', options: ['망치', '렌치', '못'] },
    { image: '✨', word: '마법', options: ['마법', '별', '반짝임'] },
    { image: '🎁', word: '선물', options: ['선물', '상자', '포장지'] },
    { image: '🎈', word: '풍선', options: ['풍선', '공', '비누방울'] },
    { image: '🎊', word: '색종이', options: ['색종이', '꽃가루', '눈송이'] },
    { image: '🎉', word: '축하', options: ['축하', '파티', '생일'] }
];

// 글자 조합 게임 데이터 (다양한 자음과 모음 조합)
const syllableGames = [
    // ㅏ 모음 조합
    { target: '가', consonant: 'ㄱ', vowel: 'ㅏ' },
    { target: '나', consonant: 'ㄴ', vowel: 'ㅏ' },
    { target: '다', consonant: 'ㄷ', vowel: 'ㅏ' },
    { target: '라', consonant: 'ㄹ', vowel: 'ㅏ' },
    { target: '마', consonant: 'ㅁ', vowel: 'ㅏ' },
    { target: '바', consonant: 'ㅂ', vowel: 'ㅏ' },
    { target: '사', consonant: 'ㅅ', vowel: 'ㅏ' },
    { target: '아', consonant: 'ㅇ', vowel: 'ㅏ' },
    { target: '자', consonant: 'ㅈ', vowel: 'ㅏ' },
    { target: '차', consonant: 'ㅊ', vowel: 'ㅏ' },
    { target: '카', consonant: 'ㅋ', vowel: 'ㅏ' },
    { target: '타', consonant: 'ㅌ', vowel: 'ㅏ' },
    { target: '파', consonant: 'ㅍ', vowel: 'ㅏ' },
    { target: '하', consonant: 'ㅎ', vowel: 'ㅏ' },
    
    // ㅗ 모음 조합
    { target: '고', consonant: 'ㄱ', vowel: 'ㅗ' },
    { target: '노', consonant: 'ㄴ', vowel: 'ㅗ' },
    { target: '도', consonant: 'ㄷ', vowel: 'ㅗ' },
    { target: '로', consonant: 'ㄹ', vowel: 'ㅗ' },
    { target: '모', consonant: 'ㅁ', vowel: 'ㅗ' },
    { target: '보', consonant: 'ㅂ', vowel: 'ㅗ' },
    { target: '소', consonant: 'ㅅ', vowel: 'ㅗ' },
    { target: '오', consonant: 'ㅇ', vowel: 'ㅗ' },
    { target: '조', consonant: 'ㅈ', vowel: 'ㅗ' },
    { target: '초', consonant: 'ㅊ', vowel: 'ㅗ' },
    { target: '코', consonant: 'ㅋ', vowel: 'ㅗ' },
    { target: '토', consonant: 'ㅌ', vowel: 'ㅗ' },
    { target: '포', consonant: 'ㅍ', vowel: 'ㅗ' },
    { target: '호', consonant: 'ㅎ', vowel: 'ㅗ' },
    
    // ㅓ 모음 조합
    { target: '거', consonant: 'ㄱ', vowel: 'ㅓ' },
    { target: '너', consonant: 'ㄴ', vowel: 'ㅓ' },
    { target: '더', consonant: 'ㄷ', vowel: 'ㅓ' },
    { target: '러', consonant: 'ㄹ', vowel: 'ㅓ' },
    { target: '머', consonant: 'ㅁ', vowel: 'ㅓ' },
    { target: '버', consonant: 'ㅂ', vowel: 'ㅓ' },
    { target: '서', consonant: 'ㅅ', vowel: 'ㅓ' },
    { target: '어', consonant: 'ㅇ', vowel: 'ㅓ' },
    { target: '저', consonant: 'ㅈ', vowel: 'ㅓ' },
    { target: '커', consonant: 'ㅋ', vowel: 'ㅓ' },
    { target: '터', consonant: 'ㅌ', vowel: 'ㅓ' },
    { target: '허', consonant: 'ㅎ', vowel: 'ㅓ' },
    
    // ㅜ 모음 조합
    { target: '구', consonant: 'ㄱ', vowel: 'ㅜ' },
    { target: '누', consonant: 'ㄴ', vowel: 'ㅜ' },
    { target: '두', consonant: 'ㄷ', vowel: 'ㅜ' },
    { target: '루', consonant: 'ㄹ', vowel: 'ㅜ' },
    { target: '무', consonant: 'ㅁ', vowel: 'ㅜ' },
    { target: '부', consonant: 'ㅂ', vowel: 'ㅜ' },
    { target: '수', consonant: 'ㅅ', vowel: 'ㅜ' },
    { target: '우', consonant: 'ㅇ', vowel: 'ㅜ' },
    { target: '주', consonant: 'ㅈ', vowel: 'ㅜ' },
    { target: '쿠', consonant: 'ㅋ', vowel: 'ㅜ' },
    { target: '투', consonant: 'ㅌ', vowel: 'ㅜ' },
    { target: '푸', consonant: 'ㅍ', vowel: 'ㅜ' },
    { target: '후', consonant: 'ㅎ', vowel: 'ㅜ' },
    
    // ㅡ 모음 조합
    { target: '그', consonant: 'ㄱ', vowel: 'ㅡ' },
    { target: '느', consonant: 'ㄴ', vowel: 'ㅡ' },
    { target: '드', consonant: 'ㄷ', vowel: 'ㅡ' },
    { target: '르', consonant: 'ㄹ', vowel: 'ㅡ' },
    { target: '므', consonant: 'ㅁ', vowel: 'ㅡ' },
    { target: '브', consonant: 'ㅂ', vowel: 'ㅡ' },
    { target: '스', consonant: 'ㅅ', vowel: 'ㅡ' },
    { target: '으', consonant: 'ㅇ', vowel: 'ㅡ' },
    { target: '즈', consonant: 'ㅈ', vowel: 'ㅡ' },
    { target: '츠', consonant: 'ㅊ', vowel: 'ㅡ' },
    { target: '크', consonant: 'ㅋ', vowel: 'ㅡ' },
    { target: '트', consonant: 'ㅌ', vowel: 'ㅡ' },
    { target: '프', consonant: 'ㅍ', vowel: 'ㅡ' },
    { target: '흐', consonant: 'ㅎ', vowel: 'ㅡ' },
    
    // ㅣ 모음 조합 
    { target: '기', consonant: 'ㄱ', vowel: 'ㅣ' },
    { target: '니', consonant: 'ㄴ', vowel: 'ㅣ' },
    { target: '디', consonant: 'ㄷ', vowel: 'ㅣ' },
    { target: '리', consonant: 'ㄹ', vowel: 'ㅣ' },
    { target: '미', consonant: 'ㅁ', vowel: 'ㅣ' },
    { target: '비', consonant: 'ㅂ', vowel: 'ㅣ' },
    { target: '시', consonant: 'ㅅ', vowel: 'ㅣ' },
    { target: '이', consonant: 'ㅇ', vowel: 'ㅣ' },
    { target: '지', consonant: 'ㅈ', vowel: 'ㅣ' },
    { target: '치', consonant: 'ㅊ', vowel: 'ㅣ' },
    { target: '히', consonant: 'ㅎ', vowel: 'ㅣ' }
];

let currentSyllableGame = syllableGames[0];

// 캔버스 설정
let isDrawing = false;

// 획순 가이드 시스템 변수
let strokeGuideState = {
    consonant: {
        currentStroke: 0,
        guideEnabled: true,
        strokeComplete: false
    },
    vowel: {
        currentStroke: 0,
        guideEnabled: true,
        strokeComplete: false
    }
};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeCanvas();
    initializeVowelCanvas();
    updateScore();
    updateLevel();
    showRandomWord();
    showRandomSyllable();
    addConfettiStyles();
    addClickEffects();
    setupButtonEvents();
    initializeStrokeGuide();
});

// 버튼 이벤트 설정
function setupButtonEvents() {
    console.log('버튼 이벤트 설정 중...');
    
    // 자음 글자 확인 버튼
    const consonantCheckBtn = document.getElementById('consonant-check-btn');
    if (consonantCheckBtn) {
        consonantCheckBtn.addEventListener('click', function() {
            console.log('자음 글자 확인 버튼 클릭됨');
            recognizeDrawing('consonant');
        });
        console.log('자음 글자 확인 버튼 이벤트 연결 완료');
    }
    
    // 자음 지우기 버튼
    const consonantClearBtn = document.getElementById('consonant-clear-btn');
    if (consonantClearBtn) {
        consonantClearBtn.addEventListener('click', function() {
            console.log('자음 캔버스 지우기 버튼 클릭됨');
            clearCanvas();
        });
        console.log('자음 지우기 버튼 이벤트 연결 완료');
    }
    
    // 모음 글자 확인 버튼
    const vowelCheckBtn = document.getElementById('vowel-check-btn');
    if (vowelCheckBtn) {
        vowelCheckBtn.addEventListener('click', function() {
            console.log('모음 글자 확인 버튼 클릭됨');
            recognizeDrawing('vowel');
        });
        console.log('모음 글자 확인 버튼 이벤트 연결 완료');
    }
    
    // 모음 지우기 버튼
    const vowelClearBtn = document.getElementById('vowel-clear-btn');
    if (vowelClearBtn) {
        vowelClearBtn.addEventListener('click', function() {
            console.log('모음 캔버스 지우기 버튼 클릭됨');
            clearVowelCanvas();
        });
        console.log('모음 지우기 버튼 이벤트 연결 완료');
    }
}

// 캔버스 초기화
function initializeCanvas() {
    canvas = document.getElementById('writing-canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#667eea';

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // 터치 이벤트 (모바일 지원)
        canvas.addEventListener('touchstart', handleTouch);
        canvas.addEventListener('touchmove', handleTouch);
        canvas.addEventListener('touchend', stopDrawing);
    }
}

// 모음 캔버스 초기화
function initializeVowelCanvas() {
    vowelCanvas = document.getElementById('vowel-canvas');
    if (vowelCanvas) {
        vowelCtx = vowelCanvas.getContext('2d');
        vowelCtx.lineWidth = 8;
        vowelCtx.lineCap = 'round';
        vowelCtx.strokeStyle = '#ff6b6b';

        vowelCanvas.addEventListener('mousedown', startVowelDrawing);
        vowelCanvas.addEventListener('mousemove', drawVowel);
        vowelCanvas.addEventListener('mouseup', stopVowelDrawing);
        vowelCanvas.addEventListener('mouseout', stopVowelDrawing);

        // 터치 이벤트
        vowelCanvas.addEventListener('touchstart', handleVowelTouch);
        vowelCanvas.addEventListener('touchmove', handleVowelTouch);
        vowelCanvas.addEventListener('touchend', stopVowelDrawing);
    }
}

// 그리기 시작 (타이머 취소 포함)
function startDrawing(e) {
    // 타이머가 있으면 취소 (아직 그리는 중이므로)
    if (consonantRecognizeTimer) {
        clearTimeout(consonantRecognizeTimer);
        consonantRecognizeTimer = null;
        console.log('자음 인식 타이머 취소 (다시 그리기 시작)');
    }
    
    isDrawing = true;
    draw(e);
}

function startVowelDrawing(e) {
    // 타이머가 있으면 취소 (아직 그리는 중이므로)
    if (vowelRecognizeTimer) {
        clearTimeout(vowelRecognizeTimer);
        vowelRecognizeTimer = null;
        console.log('모음 인식 타이머 취소 (다시 그리기 시작)');
    }
    
    isDrawing = true;
    drawVowel(e);
}

// 그리기
function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function drawVowel(e) {
    if (!isDrawing) return;
    
    const rect = vowelCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    vowelCtx.lineTo(x, y);
    vowelCtx.stroke();
    vowelCtx.beginPath();
    vowelCtx.moveTo(x, y);
}

// 자동 인식 타이머를 위한 변수들
let consonantRecognizeTimer = null;
let vowelRecognizeTimer = null;

// 그리기 중단 (개선된 자동 인식)
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        ctx.beginPath();
        
        // 기존 타이머가 있으면 취소
        if (consonantRecognizeTimer) {
            clearTimeout(consonantRecognizeTimer);
        }
        
        // 자음 게임이 활성화되어 있을 때만 타이머 설정
        const consonantGame = document.getElementById('consonants-game');
        if (consonantGame && consonantGame.classList.contains('active')) {
            // 2초 동안 그리기를 멈춘 후에만 인식
            consonantRecognizeTimer = setTimeout(() => {
                console.log('자음 자동 인식 시작 (2초 후)');
                recognizeDrawing('consonant');
                consonantRecognizeTimer = null;
            }, 2000);
        }
    }
}

function stopVowelDrawing() {
    if (isDrawing) {
        isDrawing = false;
        vowelCtx.beginPath();
        
        // 기존 타이머가 있으면 취소
        if (vowelRecognizeTimer) {
            clearTimeout(vowelRecognizeTimer);
        }
        
        // 모음 게임이 활성화되어 있을 때만 타이머 설정
        const vowelGame = document.getElementById('vowels-game');
        if (vowelGame && vowelGame.classList.contains('active')) {
            // 2초 동안 그리기를 멈춘 후에만 인식
            vowelRecognizeTimer = setTimeout(() => {
                console.log('모음 자동 인식 시작 (2초 후)');
                recognizeDrawing('vowel');
                vowelRecognizeTimer = null;
            }, 2000);
        }
    }
}

// 중복된 함수들은 위에 이미 정의되어 있으므로 제거

// 터치 이벤트 처리
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleVowelTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    vowelCanvas.dispatchEvent(mouseEvent);
}

// 캔버스 지우기
function clearCanvas() {
    console.log('clearCanvas 호출됨');
    
    // 자음 캔버스 클리어
    const writingCanvasEl = document.getElementById('writing-canvas');
    if (writingCanvasEl) {
        const writingCtx = writingCanvasEl.getContext('2d');
        writingCtx.clearRect(0, 0, writingCanvasEl.width, writingCanvasEl.height);
        
        // 사용자 그리기 스타일 재설정 (실선)
        writingCtx.strokeStyle = '#2E8B57';
        writingCtx.lineWidth = 4;
        writingCtx.lineCap = 'round';
        writingCtx.lineJoin = 'round';
        writingCtx.setLineDash([]);
        
        console.log('writing-canvas 클리어 및 스타일 재설정 완료');
    }
    
    // 그리기 상태 초기화
    window.isDrawingActive = false;
}

function clearVowelCanvas() {
    console.log('clearVowelCanvas 호출됨');
    
    // 모음 캔버스 클리어
    const writingCanvasEl = document.getElementById('vowel-canvas');
    if (writingCanvasEl) {
        const writingCtx = writingCanvasEl.getContext('2d');
        writingCtx.clearRect(0, 0, writingCanvasEl.width, writingCanvasEl.height);
        
        // 사용자 그리기 스타일 재설정 (모음용 실선)
        writingCtx.strokeStyle = '#B22222';
        writingCtx.lineWidth = 4;
        writingCtx.lineCap = 'round';
        writingCtx.lineJoin = 'round';
        writingCtx.setLineDash([]);
        
        console.log('vowel-canvas 클리어 및 스타일 재설정 완료');
    }
    
    // 그리기 상태 초기화
    window.isVowelDrawingActive = false;
}

// 글자 인식 함수 (완전히 새로운 버전)
function recognizeDrawing(canvasType) {
    console.log('🔍 글자 인식 시작:', canvasType);
    
    // 현재 글자 가져오기
    const currentLetter = canvasType === 'consonant' ? gameState.currentConsonant : gameState.currentVowel;
    console.log('현재 글자:', currentLetter);
    
    // 간단한 성공 판정 (70% 확률)
    const success = Math.random() > 0.3;
    
    // 피드백 영역 찾기 또는 생성
    const sectionId = canvasType === 'consonant' ? '#consonants-game' : '#vowels-game';
    const section = document.querySelector(sectionId);
    
    if (!section) {
        console.log('게임 섹션을 찾을 수 없음:', sectionId);
        return;
    }
    
    let feedbackElement = section.querySelector('.feedback-message');
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-message';
        feedbackElement.style.cssText = `
            margin-top: 20px;
            padding: 20px;
            border-radius: 20px;
            font-size: 1.8em;
            font-weight: bold;
            text-align: center;
            transition: all 0.3s ease;
        `;
        
        const practiceArea = section.querySelector('.practice-area');
        if (practiceArea) {
            practiceArea.appendChild(feedbackElement);
        }
    }
    
    if (success) {
        // 성공 - 글자를 읽어주기
        feedbackElement.textContent = `잘했어요! "${currentLetter}" 🎉`;
        feedbackElement.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
        feedbackElement.style.color = 'white';
        
        // 글자 자체를 읽어주기
        speakText(currentLetter);
        createConfetti();
        addScore(100);
        earnStar();
        
        // 3초 후 다음 글자로
        setTimeout(() => {
            if (canvasType === 'consonant') {
                nextConsonant();
            } else {
                nextVowel();
            }
            feedbackElement.textContent = '';
            feedbackElement.style.background = '';
        }, 3000);
        
    } else {
        // 실패
        feedbackElement.textContent = `다시 해보세요! "${currentLetter}" 💪`;
        feedbackElement.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a52)';
        feedbackElement.style.color = 'white';
        
        // 정답 글자를 읽어주기
        speakText(currentLetter);
        
        // 3초 후 메시지 지우기
        setTimeout(() => {
            feedbackElement.textContent = '';
            feedbackElement.style.background = '';
        }, 3000);
    }
    
    console.log('✅ 글자 인식 완료');
}

// 게임 섹션 표시
function showGame(gameType) {
    console.log('showGame 호출됨:', gameType);
    
    // 모든 게임 섹션 숨기기
    const sections = document.querySelectorAll('.game-section');
    console.log('게임 섹션 개수:', sections.length);
    sections.forEach(section => section.classList.remove('active'));
    
    // 모든 메뉴 버튼 비활성화
    const buttons = document.querySelectorAll('.menu-btn');
    console.log('메뉴 버튼 개수:', buttons.length);
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // 선택된 게임 섹션 표시
    const targetSection = document.getElementById(gameType + '-game');
    console.log('대상 섹션:', gameType + '-game', '존재:', !!targetSection);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('섹션 활성화 완료');
    }
    
    // 클릭된 버튼 찾기 및 활성화
    buttons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(gameType)) {
            btn.classList.add('active');
            console.log('버튼 활성화:', btn.textContent);
        }
    });
}

// 전역 함수들은 파일 끝에서 등록됨

// 자음 선택
function selectConsonant(consonant) {
    gameState.currentConsonant = consonant;
    document.getElementById('current-consonant').textContent = consonant;
    
    // 선택 효과
    const items = document.querySelectorAll('.consonant-item');
    items.forEach(item => item.classList.remove('selected'));
    
    // 올바른 요소 찾기 및 선택 표시
    items.forEach(item => {
        if (item.textContent === consonant) {
            item.classList.add('selected');
        }
    });
    
    addScore(10);
    console.log(`${consonant} 선택! 멋져요! ⭐`);
}

// 모음 선택
function selectVowel(vowel) {
    gameState.currentVowel = vowel;
    document.getElementById('current-vowel').textContent = vowel;
    
    // 선택 효과
    const items = document.querySelectorAll('.vowel-item');
    items.forEach(item => item.classList.remove('selected'));
    
    // 올바른 요소 찾기 및 선택 표시
    items.forEach(item => {
        if (item.textContent === vowel) {
            item.classList.add('selected');
        }
    });
    
    addScore(10);
    console.log(`${vowel} 선택! 잘했어요! 🌟`);
}

// 다음 자음
function nextConsonant() {
    const currentIndex = consonants.indexOf(gameState.currentConsonant);
    const nextIndex = (currentIndex + 1) % consonants.length;
    const nextConsonant = consonants[nextIndex];
    
    selectConsonantProgrammatically(nextConsonant);
}

// 다음 모음
function nextVowel() {
    const currentIndex = vowels.indexOf(gameState.currentVowel);
    const nextIndex = (currentIndex + 1) % vowels.length;
    const nextVowel = vowels[nextIndex];
    
    selectVowelProgrammatically(nextVowel);
}

// 프로그래밍 방식으로 자음 선택
function selectConsonantProgrammatically(consonant) {
    gameState.currentConsonant = consonant;
    document.getElementById('current-consonant').textContent = consonant;
    
    const items = document.querySelectorAll('.consonant-item');
    items.forEach(item => {
        item.classList.remove('selected');
        if (item.textContent === consonant) {
            item.classList.add('selected');
        }
    });
    
    clearCanvas();
    addScore(5);
}

// 프로그래밍 방식으로 모음 선택
function selectVowelProgrammatically(vowel) {
    gameState.currentVowel = vowel;
    document.getElementById('current-vowel').textContent = vowel;
    
    const items = document.querySelectorAll('.vowel-item');
    items.forEach(item => {
        item.classList.remove('selected');
        if (item.textContent === vowel) {
            item.classList.add('selected');
        }
    });
    
    clearVowelCanvas();
    addScore(5);
}

// 단어 게임
function showRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordGames.length);
    gameState.currentWordIndex = randomIndex;
    const currentGame = wordGames[randomIndex];
    
    document.getElementById('word-image').textContent = currentGame.image;
    
    const optionsContainer = document.querySelector('.word-options');
    optionsContainer.innerHTML = '';
    
    // 옵션 섞기
    const shuffledOptions = [...currentGame.options].sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'word-option';
        button.textContent = option;
        button.disabled = false; // 모든 버튼을 활성화 상태로 시작
        button.onclick = () => selectWord(option);
        optionsContainer.appendChild(button);
    });
    
    // 피드백과 다음 버튼 초기화
    document.getElementById('word-feedback').textContent = '';
    document.querySelector('.next-word-btn').style.display = 'none';
}

// 단어 선택
function selectWord(selectedWord) {
    const currentGame = wordGames[gameState.currentWordIndex];
    const feedbackElement = document.getElementById('word-feedback');
    const buttons = document.querySelectorAll('.word-option');
    
    if (selectedWord === currentGame.word) {
        // 정답인 경우
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === selectedWord) {
                btn.classList.add('correct');
            }
        });
        
        feedbackElement.textContent = '정답이에요! 🎉';
        feedbackElement.style.color = '#4ecdc4';
        
        // 정답을 음성으로 읽어주기
        speakText(currentGame.word);
        
        addScore(50);
        earnStar();
        createConfetti();
        
        // 2초 후 자동으로 다음 문제로 이동
        setTimeout(() => {
            nextWord();
        }, 2000);
        
    } else {
        // 틀린 경우 - 선택한 버튼만 빨갛게 표시하고 다른 버튼은 활성화 유지
        buttons.forEach(btn => {
            if (btn.textContent === selectedWord) {
                btn.classList.add('incorrect');
                btn.disabled = true; // 틀린 버튼만 비활성화
            }
        });
        
        feedbackElement.textContent = '다시 생각해보세요! 🤔';
        feedbackElement.style.color = '#ff6b6b';
        
        // 틀린 답변에 대한 피드백 음성 (빠르게)
        speakTextFast('틀렸습니다');
    }
}

// 다음 단어
function nextWord() {
    showRandomWord();
}

// 글자 조합 게임
function showRandomSyllable() {
    const randomIndex = Math.floor(Math.random() * syllableGames.length);
    currentSyllableGame = syllableGames[randomIndex];
    
    document.getElementById('target-syllable').textContent = currentSyllableGame.target;
    
    // 자음 옵션 설정
    const consonantOptions = document.getElementById('consonant-options');
    consonantOptions.innerHTML = '';
    
    // 정답 자음을 반드시 포함하고 나머지는 랜덤으로 선택
    const consonantChoices = [currentSyllableGame.consonant];
    console.log('정답 자음:', currentSyllableGame.consonant);
    
    // 정답이 아닌 다른 자음들 중에서 2개 추가 선택
    const availableConsonants = consonants.filter(c => c !== currentSyllableGame.consonant);
    while (consonantChoices.length < 3 && availableConsonants.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableConsonants.length);
        const selectedConsonant = availableConsonants[randomIndex];
        consonantChoices.push(selectedConsonant);
        availableConsonants.splice(randomIndex, 1); // 중복 방지를 위해 제거
    }
    
    console.log('자음 선택지들:', consonantChoices);
    
    // 선택지 순서 랜덤화하고 표시
    consonantChoices.sort(() => Math.random() - 0.5).forEach(consonant => {
        const option = document.createElement('div');
        option.className = 'part-option';
        option.textContent = consonant;
        option.onclick = () => selectPart('consonant', consonant);
        consonantOptions.appendChild(option);
    });
    
    // 모음 옵션 설정
    const vowelOptions = document.getElementById('vowel-options');
    vowelOptions.innerHTML = '';
    
    // 정답 모음을 반드시 포함하고 나머지는 랜덤으로 선택
    const vowelChoices = [currentSyllableGame.vowel];
    console.log('정답 모음:', currentSyllableGame.vowel);
    
    // 정답이 아닌 다른 모음들 중에서 2개 추가 선택
    const availableVowels = vowels.filter(v => v !== currentSyllableGame.vowel);
    while (vowelChoices.length < 3 && availableVowels.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableVowels.length);
        const selectedVowel = availableVowels[randomIndex];
        vowelChoices.push(selectedVowel);
        availableVowels.splice(randomIndex, 1); // 중복 방지를 위해 제거
    }
    
    console.log('모음 선택지들:', vowelChoices);
    
    // 선택지 순서 랜덤화하고 표시
    vowelChoices.sort(() => Math.random() - 0.5).forEach(vowel => {
        const option = document.createElement('div');
        option.className = 'part-option';
        option.textContent = vowel;
        option.onclick = () => selectPart('vowel', vowel);
        vowelOptions.appendChild(option);
    });
    
    gameState.selectedConsonant = '';
    gameState.selectedVowel = '';
    document.getElementById('combined-syllable').textContent = '?';
    document.getElementById('syllable-feedback').textContent = '';
}

// 글자 부분 선택
function selectPart(type, value) {
    if (type === 'consonant') {
        gameState.selectedConsonant = value;
        const options = document.querySelectorAll('#consonant-options .part-option');
        options.forEach(option => {
            option.classList.remove('selected');
            if (option.textContent === value) {
                option.classList.add('selected');
            }
        });
    } else if (type === 'vowel') {
        gameState.selectedVowel = value;
        const options = document.querySelectorAll('#vowel-options .part-option');
        options.forEach(option => {
            option.classList.remove('selected');
            if (option.textContent === value) {
                option.classList.add('selected');
            }
        });
    }
    
    updateCombinedSyllable();
}

// 조합된 글자 업데이트
function updateCombinedSyllable() {
    if (gameState.selectedConsonant && gameState.selectedVowel) {
        // 한글 조합 로직 (간단한 버전)
        const combinedSyllable = combineKorean(gameState.selectedConsonant, gameState.selectedVowel);
        document.getElementById('combined-syllable').textContent = combinedSyllable;
        
        // 자음과 모음이 둘 다 선택되면 0.5초 후 자동으로 확인
        setTimeout(() => {
            checkSyllableAutomatically();
        }, 500);
    }
}

// 한글 조합 함수
function combineKorean(consonant, vowel) {
    const consonantMap = {
        'ㄱ': 0, 'ㄲ': 1, 'ㄴ': 2, 'ㄷ': 3, 'ㄸ': 4, 'ㄹ': 5, 'ㅁ': 6, 'ㅂ': 7, 'ㅃ': 8,
        'ㅅ': 9, 'ㅆ': 10, 'ㅇ': 11, 'ㅈ': 12, 'ㅉ': 13, 'ㅊ': 14, 'ㅋ': 15, 'ㅌ': 16, 'ㅍ': 17, 'ㅎ': 18
    };
    
    const vowelMap = {
        'ㅏ': 0, 'ㅐ': 1, 'ㅑ': 2, 'ㅒ': 3, 'ㅓ': 4, 'ㅔ': 5, 'ㅕ': 6, 'ㅖ': 7, 'ㅗ': 8, 'ㅘ': 9,
        'ㅙ': 10, 'ㅚ': 11, 'ㅛ': 12, 'ㅜ': 13, 'ㅝ': 14, 'ㅞ': 15, 'ㅟ': 16, 'ㅠ': 17, 'ㅡ': 18, 'ㅢ': 19, 'ㅣ': 20
    };
    
    const consonantCode = consonantMap[consonant];
    const vowelCode = vowelMap[vowel];
    
    if (consonantCode !== undefined && vowelCode !== undefined) {
        const syllableCode = 0xAC00 + (consonantCode * 588) + (vowelCode * 28);
        return String.fromCharCode(syllableCode);
    }
    
    return consonant + vowel;
}

// 자동 글자 조합 확인 (자음+모음 선택 시)
function checkSyllableAutomatically() {
    const combined = document.getElementById('combined-syllable').textContent;
    const feedback = document.getElementById('syllable-feedback');
    
    if (combined === currentSyllableGame.target) {
        // 정답인 경우
        feedback.textContent = '맞았습니다! 🎉';
        feedback.style.color = '#4ecdc4';
        feedback.style.fontSize = '1.5em';
        feedback.style.fontWeight = 'bold';
        
        // "맞았습니다" 음성 먼저 재생
        speakTextFast('맞았습니다');
        
        // 1초 후에 정답 글자를 음성으로 읽어주기
        setTimeout(() => {
            speakText(currentSyllableGame.target);
        }, 1000);
        
        addScore(100);
        earnStar();
        createConfetti();
        
        // 3초 후 자동으로 다음 문제로 이동
        setTimeout(() => {
            showRandomSyllable();
        }, 3000);
    } else {
        // 틀린 경우
        feedback.textContent = '틀렸습니다! 💪';
        feedback.style.color = '#ff6b6b';
        feedback.style.fontSize = '1.5em';
        feedback.style.fontWeight = 'bold';
        
        // 틀렸다는 음성 피드백 (빠르게)
        speakTextFast('틀렸습니다');
        
        // 틀렸을 때는 선택을 초기화해서 다시 선택할 수 있게 함
        setTimeout(() => {
            gameState.selectedConsonant = '';
            gameState.selectedVowel = '';
            document.getElementById('combined-syllable').textContent = '?';
            feedback.textContent = '';
            
            // 선택된 스타일 제거
            document.querySelectorAll('.part-option.selected').forEach(option => {
                option.classList.remove('selected');
            });
        }, 2000);
    }
}

// 수동 글자 조합 확인 (확인 버튼 클릭 시)
function checkSyllable() {
    checkSyllableAutomatically();
}

// 점수 추가
function addScore(points) {
    gameState.score += points;
    updateScore();
    
    // 레벨업 체크
    if (gameState.score >= gameState.level * 500) {
        gameState.level++;
        updateLevel();
        console.log(`레벨 업! 레벨 ${gameState.level}! 🚀`);
    }
}

// 점수 업데이트
function updateScore() {
    document.getElementById('score').textContent = gameState.score;
}

// 레벨 업데이트
function updateLevel() {
    document.getElementById('level').textContent = gameState.level;
}

// 별 획득
function earnStar() {
    gameState.starsEarned++;
    updateStarsDisplay();
}

// 별 표시 업데이트
function updateStarsDisplay() {
    const starsElement = document.getElementById('stars-display');
    starsElement.textContent = '⭐'.repeat(Math.min(gameState.starsEarned, 10));
}

// 빵빠레 소리 재생 함수
function playFanfareSound() {
    // 빵빠레 소리 만들기 (Web Audio API 사용)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 빵빠레 멜로디 주파수 (C-E-G-C 아르페지오 패턴)
    const notes = [
        { freq: 523.25, duration: 0.2 }, // C5 - 빵
        { freq: 659.25, duration: 0.2 }, // E5 - 빠
        { freq: 783.99, duration: 0.2 }, // G5 - 레
        { freq: 1046.5, duration: 0.4 }  // C6 - 빵!
    ];
    
    let currentTime = audioContext.currentTime;
    
    notes.forEach((note, index) => {
        // 사인파 오실레이터 생성
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // 트럼펫 같은 음색을 위한 사인파 + 사각파 조합
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(note.freq, currentTime);
        
        // 두 번째 오실레이터 (하모닉 추가)
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(note.freq * 2, currentTime); // 옵타브 위
        
        // 빵빠레 효과를 위한 엔벨로프
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
        
        gainNode2.gain.setValueAtTime(0, currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.1, currentTime + 0.02);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
        
        // 마지막 노트는 더 길고 웅장하게
        if (index === notes.length - 1) {
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.4, currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration * 1.5);
            
            gainNode2.gain.setValueAtTime(0, currentTime);
            gainNode2.gain.linearRampToValueAtTime(0.15, currentTime + 0.02);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration * 1.5);
        }
        
        // 오디오 노드 연결
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        // 사운드 재생
        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration + 0.1);
        
        oscillator2.start(currentTime);
        oscillator2.stop(currentTime + note.duration + 0.1);
        
        currentTime += note.duration * 0.7; // 노트 간 간격
    });
}

// 폭죽 소리 재생 함수
function playFireworksSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 폭죽 터지는 소리
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        const envelope = Math.exp(-i / (audioContext.sampleRate * 0.3));
        output[i] = (Math.random() * 2 - 1) * envelope * 0.2;
    }
    
    const fireworksNoise = audioContext.createBufferSource();
    fireworksNoise.buffer = noiseBuffer;
    
    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 2000;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    fireworksNoise.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    fireworksNoise.start(audioContext.currentTime);
    fireworksNoise.stop(audioContext.currentTime + 0.5);
}

// 간단한 성공 메시지 표시 (팝업 제거)
function showSuccessAnimation(message) {
    // 색종이 효과만 유지
    if (message.includes('환영') || message.includes('정답') || message.includes('맞췄')) {
        createConfetti();
    }
    
    // 콘솔에 메시지 출력 (디버그용)
    console.log('성공:', message);
}

// 색종이 효과
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const emojis = ['🎉', '🎊', '⭐', '🌟', '✨', '🎈', '🎁', '🏆'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const isEmoji = Math.random() > 0.7;
            
            if (isEmoji) {
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confetti.style.fontSize = Math.random() * 20 + 15 + 'px';
            } else {
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            }
            
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s ease-out forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 50);
    }
}

// CSS 애니메이션을 위한 스타일 동적 추가
function addConfettiStyles() {
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettifall {
                0% {
                    transform: translateY(-100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            
            @keyframes wiggle {
                0%, 100% { transform: rotate(-3deg); }
                50% { transform: rotate(3deg); }
            }
            
            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 한글 자모음을 더 뚜렷하게 읽어주는 함수
function speakText(text) {
    if ('speechSynthesis' in window) {
        // 기존 음성 중지
        speechSynthesis.cancel();
        
        setTimeout(() => {
            // 한글 자모음을 더 명확한 발음으로 변환
            const clearText = convertToVocalReading(text);
            
            const utterance = new SpeechSynthesisUtterance();
            utterance.lang = 'ko-KR';
            utterance.rate = 0.6; // 더 천천히
            utterance.pitch = 1.2; // 조금 더 높은 톤
            utterance.volume = 1.0;
            utterance.text = clearText;
            
            // 음성 재생 이벤트 리스너
            utterance.onstart = () => console.log('음성 재생 시작:', clearText);
            utterance.onend = () => console.log('음성 재생 완료:', clearText);
            utterance.onerror = (e) => console.log('음성 재생 오류:', e);
            
            speechSynthesis.speak(utterance);
            console.log('음성 요청됨:', clearText);
        }, 150);
    } else {
        console.log('음성 합성 지원하지 않음');
    }
}

// 빠른 속도로 말하는 함수 (틀렸을 때 사용)
function speakTextFast(text) {
    if ('speechSynthesis' in window) {
        // 기존 음성 중지
        speechSynthesis.cancel();
        
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance();
            utterance.lang = 'ko-KR';
            utterance.rate = 1.0; // 빠르게
            utterance.pitch = 1.1; // 조금 높은 톤
            utterance.volume = 1.0;
            utterance.text = text;
            
            // 음성 재생 이벤트 리스너
            utterance.onstart = () => console.log('빠른 음성 재생 시작:', text);
            utterance.onend = () => console.log('빠른 음성 재생 완료:', text);
            utterance.onerror = (e) => console.log('빠른 음성 재생 오류:', e);
            
            speechSynthesis.speak(utterance);
            console.log('빠른 음성 요청됨:', text);
        }, 100);
    } else {
        console.log('음성 합성 지원하지 않음');
    }
}

// 한글 자모음을 더 명확한 발음으로 변환
function convertToVocalReading(text) {
    // 자음 발음 개선 (더 뚜렷하게)
    const consonantMap = {
        'ㄱ': '기역',
        'ㄴ': '니은',
        'ㄷ': '디귿',
        'ㄹ': '리을',
        'ㅁ': '미음',
        'ㅂ': '비읍',
        'ㅅ': '시옷',
        'ㅇ': '이응',
        'ㅈ': '지읒',
        'ㅊ': '치읓',
        'ㅋ': '키읔',
        'ㅌ': '티읕',
        'ㅍ': '피읖',
        'ㅎ': '히읗'
    };
    
    // 모음 발음 개선 (더 뚜렷하게)
    const vowelMap = {
        'ㅏ': '아',
        'ㅑ': '야',
        'ㅓ': '어',
        'ㅕ': '여',
        'ㅗ': '오',
        'ㅛ': '요',
        'ㅜ': '우',
        'ㅠ': '유',
        'ㅡ': '으',
        'ㅣ': '이'
    };
    
    // 한 글자씩 확인해서 자모음이면 변환
    if (consonantMap[text]) {
        return consonantMap[text];
    } else if (vowelMap[text]) {
        return vowelMap[text];
    }
    
    // 일반 텍스트는 그대로 반환
    return text;
}

// 소리 재생 (웹 Speech API 사용) - 개선된 버전
function playSound(type) {
    if ('speechSynthesis' in window) {
        let textToSpeak = '';
        
        switch(type) {
            case 'consonant':
                textToSpeak = gameState.currentConsonant;
                break;
            case 'vowel':
                textToSpeak = gameState.currentVowel;
                break;
            case 'syllable':
                textToSpeak = currentSyllableGame.target;
                break;
            default:
                textToSpeak = '안녕하세요';
        }
        
        // speakText 함수를 사용하여 더 뚜렷하게 발음
        speakText(textToSpeak);
        console.log('소리를 들어보세요! 🔊');
    } else {
        console.log('소리 기능을 지원하지 않는 브라우저입니다 😅');
    }
}

// 키보드 이벤트 추가
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const activeSection = document.querySelector('.game-section.active');
        if (activeSection.id === 'syllables-game') {
            checkSyllable();
        }
    }
    
    if (e.key === ' ') {
        e.preventDefault();
        const activeSection = document.querySelector('.game-section.active');
        if (activeSection.id === 'consonants-game') {
            playSound('consonant');
        } else if (activeSection.id === 'vowels-game') {
            playSound('vowel');
        } else if (activeSection.id === 'syllables-game') {
            playSound('syllable');
        }
    }
});

// 추억 갤러리 관련 기능들
function startMemoryWordGame() {
    console.log('해변 단어 찾기 게임을 시작해요! 🌊');
    
    // 해변 관련 단어 게임만 (대량 추가)
    const beachWords = [
        // 기본 해변 요소
        { image: '🌊', word: '바다', options: ['바다', '강', '호수'] },
        { image: '🏖️', word: '모래', options: ['모래', '돌', '흙'] },
        { image: '🐚', word: '조개', options: ['조개', '게', '물고기'] },
        { image: '🌴', word: '야자나무', options: ['야자나무', '소나무', '대나무'] },
        { image: '☀️', word: '햇빛', options: ['햇빛', '전등', '불빛'] },
        
        // 해변 활동
        { image: '🏄‍♂️', word: '서핑', options: ['서핑', '수영', '다이빙'] },
        { image: '🏊‍♂️', word: '수영', options: ['수영', '서핑', '다이빙'] },
        { image: '🤿', word: '다이빙', options: ['다이빙', '수영', '스노클링'] },
        { image: '🏐', word: '비치볼', options: ['비치볼', '축구공', '농구공'] },
        { image: '🏰', word: '모래성', options: ['모래성', '성', '집'] },
        
        // 해변 용품
        { image: '⛱️', word: '파라솔', options: ['파라솔', '텐트', '우산'] },
        { image: '🩱', word: '수영복', options: ['수영복', '옷', '셔츠'] },
        { image: '👙', word: '비키니', options: ['비키니', '수영복', '옷'] },
        { image: '🕶️', word: '선글라스', options: ['선글라스', '안경', '모자'] },
        { image: '🧴', word: '선크림', options: ['선크림', '로션', '크림'] },
        { image: '🩴', word: '슬리퍼', options: ['슬리퍼', '신발', '샌들'] },
        { image: '🏖️', word: '비치타월', options: ['비치타월', '수건', '담요'] },
        { image: '🪣', word: '모래통', options: ['모래통', '양동이', '바구니'] },
        { image: '🏏', word: '모래삽', options: ['모래삽', '삽', '도구'] },
        
        // 바다 생물
        { image: '🐟', word: '물고기', options: ['물고기', '상어', '고래'] },
        { image: '🦀', word: '게', options: ['게', '새우', '가재'] },
        { image: '🦐', word: '새우', options: ['새우', '게', '랍스터'] },
        { image: '🐙', word: '문어', options: ['문어', '오징어', '해파리'] },
        { image: '🦑', word: '오징어', options: ['오징어', '문어', '해파리'] },
        { image: '🐠', word: '열대어', options: ['열대어', '물고기', '금붕어'] },
        { image: '🐡', word: '복어', options: ['복어', '물고기', '상어'] },
        { image: '🦈', word: '상어', options: ['상어', '고래', '돌고래'] },
        { image: '🐳', word: '고래', options: ['고래', '돌고래', '상어'] },
        { image: '🐬', word: '돌고래', options: ['돌고래', '고래', '물개'] },
        { image: '🦭', word: '바다표범', options: ['바다표범', '물개', '돌고래'] },
        { image: '⭐', word: '불가사리', options: ['불가사리', '성게', '해삼'] },
        { image: '🦪', word: '굴', options: ['굴', '조개', '전복'] },
        
        // 해변 풍경
        { image: '🌅', word: '일출', options: ['일출', '일몰', '새벽'] },
        { image: '🌄', word: '일몰', options: ['일몰', '일출', '저녁'] },
        { image: '🏝️', word: '섬', options: ['섬', '육지', '해변'] },
        { image: '⛵', word: '요트', options: ['요트', '배', '보트'] },
        { image: '🚤', word: '보트', options: ['보트', '요트', '배'] },
        { image: '🛟', word: '튜브', options: ['튜브', '구명조끼', '부표'] },
        { image: '⚓', word: '닻', options: ['닻', '체인', '밧줄'] },
        { image: '🪨', word: '바위', options: ['바위', '돌', '모래'] },
        { image: '🌸', word: '산호', options: ['산호', '해초', '바위'] },
        { image: '🌿', word: '해초', options: ['해초', '산호', '수초'] },
        
        // 날씨와 자연
        { image: '🌬️', word: '바닷바람', options: ['바닷바람', '바람', '미풍'] },
        { image: '🌤️', word: '맑음', options: ['맑음', '구름', '비'] },
        { image: '⛅', word: '구름', options: ['구름', '맑음', '비구름'] },
        { image: '🌈', word: '무지개', options: ['무지개', '햇빛', '비'] },
        { image: '⚡', word: '번개', options: ['번개', '천둥', '폭풍'] },
        { image: '🌀', word: '태풍', options: ['태풍', '폭풍', '바람'] },
        
        // 음식과 음료
        { image: '🥥', word: '코코넛', options: ['코코넛', '야자열매', '과일'] },
        { image: '🍉', word: '수박', options: ['수박', '참외', '멜론'] },
        { image: '🧊', word: '얼음', options: ['얼음', '아이스', '차가운것'] },
        { image: '🥤', word: '음료수', options: ['음료수', '쥬스', '콜라'] },
        { image: '🍹', word: '칵테일', options: ['칵테일', '쥬스', '음료'] },
        { image: '🦞', word: '랍스터', options: ['랍스터', '새우', '게'] },
        { image: '🍤', word: '튀김새우', options: ['튀김새우', '새우', '튀김'] },
        
        // 레저 활동
        { image: '🪁', word: '연날리기', options: ['연날리기', '연', '놀이'] },
        { image: '🏃‍♂️', word: '조깅', options: ['조깅', '달리기', '운동'] },
        { image: '🚶‍♂️', word: '산책', options: ['산책', '걷기', '운동'] },
        { image: '📷', word: '사진촬영', options: ['사진촬영', '카메라', '사진'] },
        { image: '🎣', word: '낚시', options: ['낚시', '물고기', '취미'] },
        { image: '🤽‍♂️', word: '수구', options: ['수구', '수영', '운동'] },
        { image: '🏖️', word: '일광욕', options: ['일광욕', '휴식', '선탠'] },
        { image: '🧘‍♀️', word: '명상', options: ['명상', '요가', '휴식'] },
        
        // 소리와 감각
        { image: '🎵', word: '파도소리', options: ['파도소리', '바다소리', '음악'] },
        { image: '💨', word: '짠바람', options: ['짠바람', '바닷바람', '바람'] },
        { image: '👃', word: '바다냄새', options: ['바다냄새', '짠냄새', '냄새'] },
        { image: '🌡️', word: '따뜻함', options: ['따뜻함', '더위', '시원함'] },
        { image: '❄️', word: '시원함', options: ['시원함', '차가움', '따뜻함'] }
    ];
    
    // 해변 단어 게임 시작 - 기존 배열을 대체
    startSpecialWordGame(beachWords, '해변 단어 찾기');
}

function writeMemoryStory() {
    console.log('추억 일기 쓰기를 시작해요! ✏️');
    
    // 일기 쓰기 모달 생성
    const storyModal = document.createElement('div');
    storyModal.id = 'story-modal';
    storyModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const storyContent = document.createElement('div');
    storyContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 20px;
        max-width: 700px;
        width: 95%;
        max-height: 90%;
        overflow-y: auto;
    `;
    
    // 오늘 날짜 가져오기
    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    
    // 간단한 일기 쓰기 프롬프트들
    const storyPrompts = [
        '오늘 아빠와 함께 해변에 갔어요.',
        '모래성을 만들면서 신나게 놀았어요.',
        '파도 소리를 들으니 마음이 평화로워졌어요.',
        '예쁜 조개를 주워서 기뻤어요.',
        '아빠와 손을 잡고 걸었어요.'
    ];
    
    const randomPrompt = storyPrompts[Math.floor(Math.random() * storyPrompts.length)];
    
    storyContent.innerHTML = `
        <h2 style="color: #667eea; margin-bottom: 20px;">📝 추억 일기 쓰기</h2>
        <div style="text-align: center; margin-bottom: 20px; font-size: 1.2em; color: #666;">
            ${dateString}
        </div>
        <p style="margin-bottom: 15px; font-size: 1.1em;">아래 문장을 손으로 써보세요:</p>
        <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin-bottom: 20px; font-size: 1.2em; border: 2px dashed #667eea; text-align: center;">
            ${randomPrompt}
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
            <canvas id="diary-canvas" width="600" height="200" style="
                border: 3px solid #667eea;
                border-radius: 10px;
                cursor: crosshair;
                background: white;
                margin-bottom: 15px;
            "></canvas>
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button id="diary-clear-btn" style="
                    background: linear-gradient(45deg, #feca57, #ff9ff3);
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                ">지우기</button>
                <button id="diary-recognize-btn" style="
                    background: linear-gradient(45deg, #4ecdc4, #44a08d);
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                ">글자 확인</button>
            </div>
        </div>
        <div id="recognized-text" style="
            min-height: 60px;
            padding: 15px;
            border: 2px dashed #ccc;
            border-radius: 10px;
            background: #f9f9f9;
            margin-bottom: 20px;
            font-size: 1.1em;
            line-height: 1.5;
        ">여기에 인식된 글자가 나타납니다...</div>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="story-save-btn" style="
                background: linear-gradient(45deg, #54a0ff, #2e86de);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 10px;
                font-size: 1.1em;
                cursor: pointer;
            ">💾 저장하기</button>
            <button id="story-view-btn" style="
                background: linear-gradient(45deg, #5f27cd, #341f97);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 10px;
                font-size: 1.1em;
                cursor: pointer;
            ">📖 일기장 보기</button>
            <button id="story-close-btn" style="
                background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 10px;
                font-size: 1.1em;
                cursor: pointer;
            ">닫기</button>
        </div>
        <div id="story-feedback" style="margin-top: 15px; text-align: center; font-size: 1.2em; font-weight: bold;"></div>
    `;
    
    storyModal.appendChild(storyContent);
    document.body.appendChild(storyModal);
    
    // 그리기 캔버스 설정
    const diaryCanvas = document.getElementById('diary-canvas');
    const diaryCtx = diaryCanvas.getContext('2d');
    let isDiaryDrawing = false;
    let recognizedText = '';
    
    // 캔버스 스타일 설정
    diaryCtx.lineWidth = 3;
    diaryCtx.lineCap = 'round';
    diaryCtx.strokeStyle = '#333';
    
    // 그리기 이벤트
    diaryCanvas.addEventListener('mousedown', (e) => {
        isDiaryDrawing = true;
        const rect = diaryCanvas.getBoundingClientRect();
        diaryCtx.beginPath();
        diaryCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });
    
    diaryCanvas.addEventListener('mousemove', (e) => {
        if (!isDiaryDrawing) return;
        const rect = diaryCanvas.getBoundingClientRect();
        diaryCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        diaryCtx.stroke();
    });
    
    diaryCanvas.addEventListener('mouseup', () => {
        isDiaryDrawing = false;
    });
    
    // 터치 이벤트 (모바일 지원)
    diaryCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = diaryCanvas.getBoundingClientRect();
        isDiaryDrawing = true;
        diaryCtx.beginPath();
        diaryCtx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    });
    
    diaryCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDiaryDrawing) return;
        const touch = e.touches[0];
        const rect = diaryCanvas.getBoundingClientRect();
        diaryCtx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        diaryCtx.stroke();
    });
    
    diaryCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDiaryDrawing = false;
    });
    
    // 버튼 이벤트들
    document.getElementById('diary-clear-btn').addEventListener('click', () => {
        diaryCtx.clearRect(0, 0, diaryCanvas.width, diaryCanvas.height);
        document.getElementById('recognized-text').textContent = '여기에 인식된 글자가 나타납니다...';
        recognizedText = '';
    });
    
    document.getElementById('diary-recognize-btn').addEventListener('click', () => {
        // 간단한 글자 인식 시뮬레이션
        const sentences = [
            randomPrompt,
            '오늘은 즐거운 하루였어요',
            '아빠와 함께 놀았어요',
            '바다에서 재미있게 놀았어요'
        ];
        
        recognizedText = sentences[Math.floor(Math.random() * sentences.length)];
        document.getElementById('recognized-text').textContent = recognizedText;
        speakText('글자를 인식했습니다');
    });
    
    document.getElementById('story-save-btn').addEventListener('click', () => {
        if (recognizedText) {
            saveDiaryEntry(today, recognizedText);
            const feedback = document.getElementById('story-feedback');
            feedback.textContent = '일기가 저장되었습니다! 📖';
            feedback.style.color = '#4ecdc4';
            speakText('일기가 저장되었습니다');
            createConfetti();
            addScore(100);
        } else {
            const feedback = document.getElementById('story-feedback');
            feedback.textContent = '먼저 글자를 써서 인식해주세요! ✏️';
            feedback.style.color = '#ff6b6b';
            speakTextFast('먼저 글자를 써주세요');
        }
    });
    
    document.getElementById('story-view-btn').addEventListener('click', () => {
        showDiaryList();
    });
    
    document.getElementById('story-close-btn').addEventListener('click', () => {
        document.body.removeChild(storyModal);
    });
    
    // 배경 클릭으로 닫기
    storyModal.addEventListener('click', (e) => {
        if (e.target === storyModal) {
            document.body.removeChild(storyModal);
        }
    });
    
    speakText('추억 일기 쓰기를 시작해요');
}

function familyWordChallenge() {
    console.log('가족 단어 챌린지를 시작해요! 👨‍👩‍👦');
    
    // 가족 관련 단어 게임만 (대량 추가)
    const familyWords = [
        // 핵가족
        { image: '👨‍👦', word: '아빠', options: ['아빠', '삼촌', '할아버지'] },
        { image: '👩', word: '엄마', options: ['엄마', '이모', '할머니'] },
        { image: '👶', word: '아기', options: ['아기', '형', '누나'] },
        { image: '👦', word: '아들', options: ['아들', '딸', '형'] },
        { image: '👧', word: '딸', options: ['딸', '아들', '누나'] },
        { image: '👨‍👩‍👦', word: '가족', options: ['가족', '친구', '선생님'] },
        { image: '👪', word: '우리가족', options: ['우리가족', '가족', '식구'] },
        
        // 형제자매
        { image: '👦', word: '형', options: ['형', '동생', '누나'] },
        { image: '👧', word: '누나', options: ['누나', '언니', '형'] },
        { image: '👧', word: '언니', options: ['언니', '누나', '동생'] },
        { image: '👶', word: '동생', options: ['동생', '형', '언니'] },
        { image: '👬', word: '형제', options: ['형제', '자매', '친구'] },
        { image: '👭', word: '자매', options: ['자매', '형제', '친구'] },
        { image: '👫', word: '남매', options: ['남매', '형제', '자매'] },
        
        // 조부모
        { image: '👴', word: '할아버지', options: ['할아버지', '아빠', '삼촌'] },
        { image: '👵', word: '할머니', options: ['할머니', '엄마', '이모'] },
        { image: '👴👵', word: '조부모', options: ['조부모', '부모', '어른'] },
        { image: '🏡', word: '할머니집', options: ['할머니집', '우리집', '집'] },
        
        // 친척
        { image: '👨', word: '삼촌', options: ['삼촌', '아빠', '이모부'] },
        { image: '👩', word: '이모', options: ['이모', '엄마', '고모'] },
        { image: '👩', word: '고모', options: ['고모', '이모', '엄마'] },
        { image: '👨', word: '외삼촌', options: ['외삼촌', '삼촌', '이모부'] },
        { image: '👩', word: '외할머니', options: ['외할머니', '할머니', '엄마'] },
        { image: '👴', word: '외할아버지', options: ['외할아버지', '할아버지', '아빠'] },
        { image: '👦', word: '사촌', options: ['사촌', '형', '친구'] },
        
        // 집과 생활공간
        { image: '🏠', word: '우리집', options: ['우리집', '학교', '동네'] },
        { image: '🚪', word: '대문', options: ['대문', '문', '창문'] },
        { image: '🛏️', word: '침실', options: ['침실', '거실', '부엌'] },
        { image: '🛋️', word: '거실', options: ['거실', '침실', '부엌'] },
        { image: '🍽️', word: '부엌', options: ['부엌', '거실', '욕실'] },
        { image: '🚿', word: '욕실', options: ['욕실', '화장실', '부엌'] },
        { image: '📺', word: '방', options: ['방', '거실', '화장실'] },
        { image: '🪜', word: '다락방', options: ['다락방', '지하실', '방'] },
        { image: '🌺', word: '정원', options: ['정원', '마당', '공원'] },
        
        // 가족 활동
        { image: '🍽️', word: '식사', options: ['식사', '요리', '간식'] },
        { image: '🥘', word: '저녁식사', options: ['저녁식사', '아침식사', '점심식사'] },
        { image: '☕', word: '아침식사', options: ['아침식사', '저녁식사', '간식'] },
        { image: '🍳', word: '요리', options: ['요리', '음식', '식사'] },
        { image: '🧹', word: '청소', options: ['청소', '정리', '빨래'] },
        { image: '👕', word: '빨래', options: ['빨래', '청소', '정리'] },
        { image: '🛒', word: '장보기', options: ['장보기', '쇼핑', '시장'] },
        { image: '🚗', word: '드라이브', options: ['드라이브', '여행', '나들이'] },
        
        // 특별한 날들
        { image: '🎂', word: '생일', options: ['생일', '파티', '축하'] },
        { image: '🎄', word: '크리스마스', options: ['크리스마스', '생일', '설날'] },
        { image: '🎆', word: '새해', options: ['새해', '크리스마스', '생일'] },
        { image: '🌙', word: '추석', options: ['추석', '설날', '명절'] },
        { image: '🌅', word: '설날', options: ['설날', '추석', '새해'] },
        { image: '💐', word: '어버이날', options: ['어버이날', '생일', '기념일'] },
        { image: '💒', word: '결혼기념일', options: ['결혼기념일', '생일', '기념일'] },
        
        // 선물과 표현
        { image: '🎁', word: '선물', options: ['선물', '장난감', '책'] },
        { image: '💝', word: '깜짝선물', options: ['깜짝선물', '선물', '서프라이즈'] },
        { image: '🌹', word: '꽃선물', options: ['꽃선물', '꽃다발', '꽃'] },
        { image: '💌', word: '편지', options: ['편지', '카드', '메모'] },
        { image: '💳', word: '카드', options: ['카드', '편지', '선물'] },
        { image: '📱', word: '안부전화', options: ['안부전화', '전화', '연락'] },
        
        // 감정과 관계
        { image: '❤️', word: '사랑', options: ['사랑', '좋아', '기쁨'] },
        { image: '💕', word: '애정', options: ['애정', '사랑', '정'] },
        { image: '🤗', word: '포옹', options: ['포옹', '안아줌', '껴안기'] },
        { image: '😘', word: '뽀뽀', options: ['뽀뽀', '키스', '애정'] },
        { image: '👐', word: '안아줌', options: ['안아줌', '포옹', '껴안기'] },
        { image: '🤝', word: '약속', options: ['약속', '맹세', '다짐'] },
        { image: '😊', word: '웃음', options: ['웃음', '기쁨', '행복'] },
        { image: '😢', word: '눈물', options: ['눈물', '슬픔', '울음'] },
        { image: '😌', word: '행복', options: ['행복', '기쁨', '만족'] },
        
        // 돌봄과 보살핌
        { image: '🍼', word: '젖병', options: ['젖병', '우유', '이유식'] },
        { image: '👶', word: '기저귀', options: ['기저귀', '옷', '분유'] },
        { image: '🛁', word: '목욕', options: ['목욕', '씻기', '청결'] },
        { image: '📖', word: '동화책', options: ['동화책', '책', '이야기'] },
        { image: '🎵', word: '자장가', options: ['자장가', '노래', '음악'] },
        { image: '😴', word: '잠자리', options: ['잠자리', '수면', '휴식'] },
        { image: '🤒', word: '간병', options: ['간병', '돌봄', '치료'] },
        { image: '💊', word: '약', options: ['약', '치료', '병원'] },
        
        // 교육과 성장
        { image: '🎒', word: '학교', options: ['학교', '유치원', '공부'] },
        { image: '✏️', word: '숙제', options: ['숙제', '공부', '학습'] },
        { image: '📚', word: '공부', options: ['공부', '학습', '교육'] },
        { image: '🏆', word: '칭찬', options: ['칭찬', '상', '격려'] },
        { image: '⭐', word: '잘했어', options: ['잘했어', '칭찬', '격려'] },
        { image: '👏', word: '박수', options: ['박수', '칭찬', '응원'] },
        { image: '📝', word: '일기', options: ['일기', '글쓰기', '기록'] },
        { image: '🎨', word: '그림', options: ['그림', '미술', '창작'] },
        
        // 놀이와 취미
        { image: '🎮', word: '게임', options: ['게임', '놀이', '취미'] },
        { image: '🧸', word: '인형', options: ['인형', '장난감', '놀이'] },
        { image: '⚽', word: '공놀이', options: ['공놀이', '축구', '운동'] },
        { image: '🚂', word: '기차놀이', options: ['기차놀이', '놀이', '장난감'] },
        { image: '🧩', word: '퍼즐', options: ['퍼즐', '게임', '놀이'] },
        { image: '🎪', word: '놀이공원', options: ['놀이공원', '공원', '나들이'] },
        { image: '🎠', word: '회전목마', options: ['회전목마', '놀이기구', '놀이'] },
        { image: '🎡', word: '관람차', options: ['관람차', '놀이기구', '높이'] },
        
        // 소통과 언어
        { image: '🗣️', word: '대화', options: ['대화', '이야기', '소통'] },
        { image: '👂', word: '들어주기', options: ['들어주기', '경청', '소통'] },
        { image: '💬', word: '이야기', options: ['이야기', '대화', '소통'] },
        { image: '📞', word: '전화', options: ['전화', '통화', '연락'] },
        { image: '💌', word: '소식', options: ['소식', '연락', '안부'] },
        { image: '🤫', word: '비밀', options: ['비밀', '속삭임', '내밀함'] },
        { image: '👍', word: '응원', options: ['응원', '격려', '지지'] },
        
        // 추억과 기억
        { image: '📸', word: '사진', options: ['사진', '추억', '기념'] },
        { image: '📹', word: '동영상', options: ['동영상', '비디오', '기록'] },
        { image: '📝', word: '추억', options: ['추억', '기억', '과거'] },
        { image: '🎞️', word: '앨범', options: ['앨범', '사진첩', '기록'] },
        { image: '💭', word: '기억', options: ['기억', '추억', '생각'] },
        { image: '⏰', word: '시간', options: ['시간', '순간', '기회'] },
        { image: '🌟', word: '소중함', options: ['소중함', '귀함', '가치'] }
    ];
    
    // 가족 단어 게임 시작 - 기존 배열을 대체
    startSpecialWordGame(familyWords, '가족 단어 챌린지');
}

// 추억갤러리 단어 태그 탐색 기능
function exploreWordTag(word) {
    console.log(`"${word}" 단어를 탐색합니다! 🔍`);
    
    // 단어별 맞춤 활동 제공
    const wordActivities = {
        '바다': {
            emoji: '🌊',
            title: '바다 탐험',
            description: '바다와 관련된 모든 것을 알아보자!',
            activities: [
                { name: '바다 동물 찾기', action: () => startOceanAnimalGame() },
                { name: '바다 소리 듣기', action: () => playOceanSounds() },
                { name: '해변 단어 게임', action: () => startMemoryWordGame() }
            ]
        },
        '모래': {
            emoji: '🏖️',
            title: '모래 놀이',
            description: '모래와 함께 재미있게 놀아보자!',
            activities: [
                { name: '모래성 만들기', action: () => buildSandCastle() },
                { name: '모래 그림 그리기', action: () => drawInSand() },
                { name: '해변 단어 게임', action: () => startMemoryWordGame() }
            ]
        },
        '조개': {
            emoji: '🐚',
            title: '조개 탐험',
            description: '바닷가의 예쁜 조개들을 찾아보자!',
            activities: [
                { name: '조개 수집 게임', action: () => collectShells() },
                { name: '조개 소리 듣기', action: () => listenToShells() },
                { name: '바다 생물 퀴즈', action: () => startOceanAnimalGame() }
            ]
        },
        '아빠': {
            emoji: '👨‍👦',
            title: '아빠와 함께',
            description: '사랑하는 아빠와의 소중한 시간!',
            activities: [
                { name: '가족 단어 챌린지', action: () => familyWordChallenge() },
                { name: '아빠 이야기', action: () => tellDadStory() },
                { name: '가족 사진 보기', action: () => viewFamilyPhotos() }
            ]
        },
        '웃음': {
            emoji: '😊',
            title: '즐거운 웃음',
            description: '행복하고 즐거운 순간들을 기억해요!',
            activities: [
                { name: '웃음 소리 만들기', action: () => makeLaughterSounds() },
                { name: '행복 단어 찾기', action: () => findHappyWords() },
                { name: '추억 일기 쓰기', action: () => writeMemoryStory() }
            ]
        }
    };
    
    const activity = wordActivities[word];
    if (!activity) {
        speakText(`${word}에 대해 더 알아보세요`);
        return;
    }
    
    // 단어 탐험 모달 생성
    showWordExplorationModal(activity);
    speakText(`${activity.title}를 시작합니다`);
}

function showWordExplorationModal(activity) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        text-align: center;
    `;
    
    content.innerHTML = `
        <div style="font-size: 4em; margin-bottom: 15px;">${activity.emoji}</div>
        <h2 style="color: #667eea; margin-bottom: 15px;">${activity.title}</h2>
        <p style="color: #666; margin-bottom: 25px; font-size: 1.1em;">${activity.description}</p>
        <div style="display: flex; flex-direction: column; gap: 15px;">
            ${activity.activities.map((act, index) => `
                <button onclick="selectWordActivity(${index})" style="
                    background: linear-gradient(45deg, #4ecdc4, #44a08d);
                    color: white;
                    border: none;
                    padding: 15px 20px;
                    border-radius: 15px;
                    font-size: 1.1em;
                    cursor: pointer;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    ${act.name}
                </button>
            `).join('')}
        </div>
        <button onclick="closeWordModal()" style="
            background: linear-gradient(45deg, #ff6b6b, #ee5a52);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 10px;
            font-size: 1em;
            cursor: pointer;
            margin-top: 20px;
        ">닫기</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // 전역에서 접근할 수 있도록 저장
    window.currentWordActivities = activity.activities;
    window.currentWordModal = modal;
    
    // 배경 클릭으로 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function selectWordActivity(index) {
    const activities = window.currentWordActivities;
    if (activities && activities[index]) {
        // 모달 닫기
        if (window.currentWordModal) {
            document.body.removeChild(window.currentWordModal);
        }
        
        // 활동 실행
        activities[index].action();
    }
}

function closeWordModal() {
    if (window.currentWordModal) {
        document.body.removeChild(window.currentWordModal);
    }
}

// 새로운 단어 활동들
function startOceanAnimalGame() {
    // 바다 동물만 포함된 특별 단어 게임 (대폭 확장)
    const oceanWords = [
        // 물고기류
        { image: '🐟', word: '물고기', options: ['물고기', '상어', '고래'] },
        { image: '🐠', word: '열대어', options: ['열대어', '금붕어', '잉어'] },
        { image: '🐡', word: '복어', options: ['복어', '가오리', '참치'] },
        { image: '🦈', word: '상어', options: ['상어', '고래', '돌고래'] },
        { image: '🐅', word: '참치', options: ['참치', '연어', '고등어'] },
        { image: '🐟', word: '연어', options: ['연어', '참치', '송어'] },
        { image: '🐟', word: '고등어', options: ['고등어', '삼치', '갈치'] },
        { image: '🦓', word: '가오리', options: ['가오리', '상어', '복어'] },
        
        // 갑각류
        { image: '🦀', word: '게', options: ['게', '새우', '가재'] },
        { image: '🦐', word: '새우', options: ['새우', '게', '랍스터'] },
        { image: '🦞', word: '랍스터', options: ['랍스터', '새우', '게'] },
        { image: '🦀', word: '꽃게', options: ['꽃게', '대게', '털게'] },
        { image: '🦀', word: '대게', options: ['대게', '꽃게', '털게'] },
        
        // 연체동물
        { image: '🐙', word: '문어', options: ['문어', '오징어', '해파리'] },
        { image: '🦑', word: '오징어', options: ['오징어', '문어', '낙지'] },
        { image: '🐙', word: '낙지', options: ['낙지', '문어', '오징어'] },
        { image: '🐚', word: '조개', options: ['조개', '굴', '전복'] },
        { image: '🦪', word: '굴', options: ['굴', '조개', '홍합'] },
        { image: '🐚', word: '홍합', options: ['홍합', '굴', '바지락'] },
        { image: '🐚', word: '바지락', options: ['바지락', '홍합', '재첩'] },
        { image: '🐌', word: '소라', options: ['소라', '고둥', '달팽이'] },
        { image: '🐚', word: '전복', options: ['전복', '소라', '굴'] },
        
        // 대형 해양동물
        { image: '🐳', word: '고래', options: ['고래', '돌고래', '상어'] },
        { image: '🐬', word: '돌고래', options: ['돌고래', '고래', '물개'] },
        { image: '🦭', word: '바다표범', options: ['바다표범', '물개', '바다사자'] },
        { image: '🦭', word: '물개', options: ['물개', '바다표범', '바다사자'] },
        { image: '🐋', word: '향유고래', options: ['향유고래', '혹등고래', '범고래'] },
        { image: '🐳', word: '범고래', options: ['범고래', '향유고래', '혹등고래'] },
        
        // 기타 바다생물
        { image: '🪼', word: '해파리', options: ['해파리', '말미잘', '산호'] },
        { image: '⭐', word: '불가사리', options: ['불가사리', '성게', '해삼'] },
        { image: '🦔', word: '성게', options: ['성게', '불가사리', '해삼'] },
        { image: '🥒', word: '해삼', options: ['해삼', '성게', '불가사리'] },
        { image: '🪸', word: '산호', options: ['산호', '해초', '말미잘'] },
        { image: '🌿', word: '해초', options: ['해초', '산호', '미역'] },
        { image: '🌊', word: '미역', options: ['미역', '다시마', '김'] },
        { image: '🟫', word: '다시마', options: ['다시마', '미역', '김'] },
        { image: '🌀', word: '플랑크톤', options: ['플랑크톤', '크릴', '해초'] },
        
        // 특별한 바다생물
        { image: '🐢', word: '바다거북', options: ['바다거북', '육지거북', '자라'] },
        { image: '🐧', word: '펭귄', options: ['펭귄', '바다오리', '갈매기'] },
        { image: '🦅', word: '갈매기', options: ['갈매기', '바다제비', '펠리컨'] },
        { image: '🐟', word: '아귀', options: ['아귀', '광어', '가자미'] },
        { image: '🐟', word: '광어', options: ['광어', '가자미', '넙치'] },
        { image: '🐟', word: '가자미', options: ['가자미', '광어', '넙치'] },
        { image: '🌊', word: '꼴뚜기', options: ['꼴뚜기', '한치', '갑오징어'] }
    ];
    
    startSpecialWordGame(oceanWords, '바다 동물 찾기');
}

function playOceanSounds() {
    speakText('파도가 철썩철썩 소리를 내며 해변으로 밀려와요');
    createConfetti();
}

function buildSandCastle() {
    speakText('모래성 만들기 게임을 시작합니다');
    showSandCastleGame();
}

function showSandCastleGame() {
    const gameModal = document.createElement('div');
    gameModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #87CEEB 0%, #F0E68C 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    gameModal.innerHTML = `
        <div style="text-align: center; color: #333; margin-bottom: 20px;">
            <h2 style="font-size: 2.5em; margin-bottom: 10px;">🏰 모래성 만들기</h2>
            <p style="font-size: 1.2em;">모래 부분들을 클릭해서 모래성을 완성하세요!</p>
        </div>
        
        <div id="sand-castle-container" style="
            position: relative;
            width: 400px;
            height: 300px;
            background: linear-gradient(to bottom, #F0E68C 0%, #DEB887 100%);
            border-radius: 10px;
            border: 3px solid #8B4513;
            margin: 20px;
        ">
            <!-- 모래성 부품들 -->
            <div class="castle-part" data-part="base" style="
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 150px;
                height: 80px;
                background: #DDD;
                border: 2px dashed #999;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: #666;
                transition: all 0.3s;
            ">기초 성벽</div>
            
            <div class="castle-part" data-part="tower1" style="
                position: absolute;
                bottom: 100px;
                left: 80px;
                width: 60px;
                height: 100px;
                background: #DDD;
                border: 2px dashed #999;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: #666;
                transition: all 0.3s;
            ">왼쪽 탑</div>
            
            <div class="castle-part" data-part="tower2" style="
                position: absolute;
                bottom: 100px;
                right: 80px;
                width: 60px;
                height: 100px;
                background: #DDD;
                border: 2px dashed #999;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: #666;
                transition: all 0.3s;
            ">오른쪽 탑</div>
            
            <div class="castle-part" data-part="center" style="
                position: absolute;
                bottom: 120px;
                left: 50%;
                transform: translateX(-50%);
                width: 80px;
                height: 120px;
                background: #DDD;
                border: 2px dashed #999;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: #666;
                transition: all 0.3s;
            ">중앙 성</div>
            
            <div class="castle-part" data-part="flag" style="
                position: absolute;
                bottom: 240px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 40px;
                background: #DDD;
                border: 2px dashed #999;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                color: #666;
                transition: all 0.3s;
            ">깃발</div>
        </div>
        
        <div style="margin: 20px; text-align: center;">
            <div id="castle-progress" style="font-size: 1.3em; margin-bottom: 15px; font-weight: bold;">
                완성도: <span id="progress-count">0</span>/5
            </div>
            <button onclick="closeSandCastleGame()" style="
                background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 10px;
                font-size: 1.1em;
                cursor: pointer;
            ">게임 끝내기</button>
        </div>
    `;
    
    document.body.appendChild(gameModal);
    window.sandCastleModal = gameModal;
    window.castleProgress = 0;
    
    // 모래성 부품 클릭 이벤트
    const castleParts = gameModal.querySelectorAll('.castle-part');
    castleParts.forEach(part => {
        part.addEventListener('click', function() {
            if (this.classList.contains('completed')) return;
            
            buildCastlePart(this);
        });
        
        part.addEventListener('mouseover', function() {
            if (!this.classList.contains('completed')) {
                this.style.backgroundColor = '#F0E68C';
                this.style.transform += ' scale(1.05)';
            }
        });
        
        part.addEventListener('mouseout', function() {
            if (!this.classList.contains('completed')) {
                this.style.backgroundColor = '#DDD';
                this.style.transform = this.style.transform.replace(' scale(1.05)', '');
            }
        });
    });
}

function buildCastlePart(partElement) {
    const partType = partElement.dataset.part;
    const sandColors = ['#DEB887', '#D2B48C', '#BC9A6A', '#A0845C'];
    const randomColor = sandColors[Math.floor(Math.random() * sandColors.length)];
    
    // 모래성 부품 완성 애니메이션
    partElement.style.background = `linear-gradient(45deg, ${randomColor}, #8B7355)`;
    partElement.style.border = '2px solid #654321';
    partElement.style.color = 'white';
    partElement.style.fontWeight = 'bold';
    partElement.classList.add('completed');
    
    // 부품별 모양 추가
    switch(partType) {
        case 'base':
            partElement.textContent = '🏰';
            partElement.style.fontSize = '2em';
            break;
        case 'tower1':
        case 'tower2':
            partElement.textContent = '🗼';
            partElement.style.fontSize = '1.5em';
            break;
        case 'center':
            partElement.textContent = '🏛️';
            partElement.style.fontSize = '1.8em';
            break;
        case 'flag':
            partElement.textContent = '🚩';
            partElement.style.fontSize = '1.2em';
            break;
    }
    
    // 완성 효과
    createBuildingEffect(partElement);
    speakTextFast(`${getPartName(partType)}을 완성했습니다`);
    
    window.castleProgress++;
    document.getElementById('progress-count').textContent = window.castleProgress;
    addScore(50);
    
    // 모든 부품 완성시
    if (window.castleProgress === 5) {
        setTimeout(() => {
            speakText('멋진 모래성이 완성되었습니다');
            createConfetti();
            addScore(200);
            
            setTimeout(() => {
                closeSandCastleGame();
            }, 3000);
        }, 1000);
    }
}

function getPartName(partType) {
    const names = {
        'base': '기초 성벽',
        'tower1': '왼쪽 망루',
        'tower2': '오른쪽 망루',
        'center': '중앙 성채',
        'flag': '승리의 깃발'
    };
    return names[partType] || '모래성 부품';
}

function createBuildingEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width/2}px;
                top: ${rect.top + rect.height/2}px;
                width: 8px;
                height: 8px;
                background: #F0E68C;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10002;
                animation: buildParticle 1s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }, i * 50);
    }
}

function closeSandCastleGame() {
    if (window.sandCastleModal) {
        document.body.removeChild(window.sandCastleModal);
        window.sandCastleModal = null;
    }
}

function drawInSand() {
    speakText('모래 위에 그림을 그려보세요');
    showSandDrawingGame();
}

function showSandDrawingGame() {
    const drawingModal = document.createElement('div');
    drawingModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #87CEEB 0%, #F4A460 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    drawingModal.innerHTML = `
        <div style="text-align: center; color: #333; margin-bottom: 20px;">
            <h2 style="font-size: 2.5em; margin-bottom: 10px;">🏖️ 모래 그림 그리기</h2>
            <p style="font-size: 1.2em;">모래 위에 손가락으로 그림을 그어보세요!</p>
        </div>
        
        <div style="
            position: relative;
            background: linear-gradient(45deg, #F4A460, #DEB887);
            border: 5px solid #8B4513;
            border-radius: 15px;
            padding: 20px;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        ">
            <canvas id="sand-canvas" width="500" height="350" style="
                background: linear-gradient(45deg, #F0E68C, #DEB887);
                cursor: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><circle cx=%2210%22 cy=%2210%22 r=%225%22 fill=%22%23654321%22/></svg>'), auto;
                border-radius: 10px;
                border: 2px solid #CD853F;
            "></canvas>
            
            <!-- 모래 입자 효과 영역 -->
            <div id="sand-particles" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: hidden;
            "></div>
        </div>
        
        <div style="margin: 20px; text-align: center;">
            <div style="margin-bottom: 15px;">
                <button onclick="clearSandDrawing()" style="
                    background: linear-gradient(45deg, #4ecdc4, #44a08d);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 10px;
                    font-size: 1.1em;
                    cursor: pointer;
                    margin: 0 10px;
                ">모래 평평하게</button>
                
                <button onclick="addSandDecoration()" style="
                    background: linear-gradient(45deg, #feca57, #ff9ff3);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 10px;
                    font-size: 1.1em;
                    cursor: pointer;
                    margin: 0 10px;
                ">조개 장식</button>
            </div>
            
            <button onclick="closeSandDrawing()" style="
                background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 10px;
                font-size: 1.1em;
                cursor: pointer;
            ">그리기 끝내기</button>
        </div>
    `;
    
    document.body.appendChild(drawingModal);
    window.sandDrawingModal = drawingModal;
    
    // 모래 그리기 캔버스 설정
    const sandCanvas = document.getElementById('sand-canvas');
    const sandCtx = sandCanvas.getContext('2d');
    let isDrawing = false;
    
    sandCtx.lineWidth = 8;
    sandCtx.lineCap = 'round';
    sandCtx.lineJoin = 'round';
    sandCtx.globalCompositeOperation = 'multiply';
    
    // 그리기 이벤트
    sandCanvas.addEventListener('mousedown', (e) => startSandDrawing(e, sandCanvas, sandCtx));
    sandCanvas.addEventListener('mousemove', (e) => drawInSandCanvas(e, sandCanvas, sandCtx));
    sandCanvas.addEventListener('mouseup', () => stopSandDrawing());
    sandCanvas.addEventListener('mouseout', () => stopSandDrawing());
    
    // 터치 이벤트
    sandCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = sandCanvas.getBoundingClientRect();
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        sandCanvas.dispatchEvent(mouseEvent);
    });
    
    sandCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        sandCanvas.dispatchEvent(mouseEvent);
    });
    
    sandCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        sandCanvas.dispatchEvent(mouseEvent);
    });
    
    function startSandDrawing(e, canvas, ctx) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        // 모래 입자 효과
        createSandParticles(x + rect.left, y + rect.top);
    }
    
    function drawInSandCanvas(e, canvas, ctx) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 모래를 파내는 효과 (어두운 선)
        ctx.strokeStyle = '#8B7355';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        // 연속적인 모래 입자 효과
        if (Math.random() > 0.7) {
            createSandParticles(x + rect.left, y + rect.top);
        }
    }
    
    function stopSandDrawing() {
        isDrawing = false;
    }
    
    window.sandDrawingData = { isDrawing, sandCanvas, sandCtx };
}

function createSandParticles(x, y) {
    const particlesContainer = document.getElementById('sand-particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            left: ${x - particlesContainer.getBoundingClientRect().left + (Math.random() - 0.5) * 20}px;
            top: ${y - particlesContainer.getBoundingClientRect().top + (Math.random() - 0.5) * 20}px;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${['#DEB887', '#D2B48C', '#F4A460', '#CD853F'][Math.floor(Math.random() * 4)]};
            border-radius: 50%;
            pointer-events: none;
            animation: sandParticleFall ${Math.random() * 1 + 0.5}s ease-out forwards;
        `;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1500);
    }
}

function clearSandDrawing() {
    if (window.sandDrawingData && window.sandDrawingData.sandCtx) {
        const ctx = window.sandDrawingData.sandCtx;
        const canvas = window.sandDrawingData.sandCanvas;
        
        // 부드러운 지우기 애니메이션
        let alpha = 0.1;
        const clearInterval = setInterval(() => {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = alpha;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
            
            alpha += 0.1;
            if (alpha > 1) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                clearInterval(clearInterval);
                speakTextFast('모래가 평평해졌습니다');
            }
        }, 50);
    }
}

function addSandDecoration() {
    if (window.sandDrawingData && window.sandDrawingData.sandCtx) {
        const ctx = window.sandDrawingData.sandCtx;
        const canvas = window.sandDrawingData.sandCanvas;
        
        // 랜덤 위치에 조개 그리기
        for (let i = 0; i < 3; i++) {
            const x = Math.random() * (canvas.width - 40) + 20;
            const y = Math.random() * (canvas.height - 40) + 20;
            
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            
            const decorations = ['🐚', '⭐', '🦀', '🐟'];
            const decoration = decorations[Math.floor(Math.random() * decorations.length)];
            ctx.fillText(decoration, x, y);
            ctx.restore();
        }
        
        speakTextFast('조개와 불가사리를 올려놨습니다');
        createConfetti();
        addScore(30);
    }
}

function closeSandDrawing() {
    if (window.sandDrawingModal) {
        document.body.removeChild(window.sandDrawingModal);
        window.sandDrawingModal = null;
        window.sandDrawingData = null;
    }
}

function collectShells() {
    speakText('조개 수집 게임을 시작합니다');
    showShellCollectionGame();
}

function showShellCollectionGame() {
    const gameModal = document.createElement('div');
    gameModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #4A90E2 0%, #87CEEB 50%, #F0E68C 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        overflow: hidden;
    `;
    
    gameModal.innerHTML = `
        <div style="text-align: center; color: #333; margin-bottom: 20px; z-index: 10002;">
            <h2 style="font-size: 2.5em; margin-bottom: 10px;">🐚 조개 수집 게임</h2>
            <p style="font-size: 1.2em;">해변에 숨어있는 조개들을 클릭해서 수집하세요!</p>
            <div id="shell-score" style="font-size: 1.5em; font-weight: bold; margin-top: 10px;">
                수집한 조개: <span id="shell-count">0</span>/20
            </div>
        </div>
        
        <div id="beach-area" style="
            position: relative;
            width: 90%;
            height: 60%;
            background: linear-gradient(to bottom, #87CEEB 0%, #F0E68C 30%, #DEB887 100%);
            border-radius: 20px;
            border: 5px solid #8B4513;
            overflow: hidden;
            cursor: crosshair;
        ">
            <!-- 파도 애니메이션 -->
            <div class="wave" style="
                position: absolute;
                top: 0;
                left: -100%;
                width: 200%;
                height: 30%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: wave 3s linear infinite;
            "></div>
        </div>
        
        <div style="margin: 20px; text-align: center; z-index: 10002;">
            <div id="time-remaining" style="font-size: 1.2em; margin-bottom: 15px; font-weight: bold;">
                남은 시간: <span id="timer">60</span>초
            </div>
            <button onclick="closeShellCollection()" style="
                background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 10px;
                font-size: 1.1em;
                cursor: pointer;
            ">게임 끝내기</button>
        </div>
    `;
    
    document.body.appendChild(gameModal);
    window.shellGameModal = gameModal;
    window.shellCount = 0;
    window.gameTime = 60;
    window.shellsData = [];
    
    const beachArea = document.getElementById('beach-area');
    
    // 조개 생성 함수
    function createShell() {
        const shells = ['🐚', '🦪', '🐌', '⭐', '🦀'];
        const shell = document.createElement('div');
        const shellType = shells[Math.floor(Math.random() * shells.length)];
        
        shell.innerHTML = shellType;
        shell.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10001;
            animation: shellSparkle 2s infinite alternate;
        `;
        
        // 랜덤 위치 (해변 영역 내)
        const x = Math.random() * 85 + 5; // 5% ~ 90%
        const y = Math.random() * 70 + 25; // 25% ~ 95% (파도 영역 제외)
        shell.style.left = x + '%';
        shell.style.top = y + '%';
        
        // 클릭 이벤트
        shell.addEventListener('click', function(e) {
            e.stopPropagation();
            collectShellItem(this, shellType);
        });
        
        // 호버 효과
        shell.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.3) rotate(10deg)';
            this.style.filter = 'drop-shadow(0 0 10px gold)';
        });
        
        shell.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.filter = 'none';
        });
        
        beachArea.appendChild(shell);
        window.shellsData.push(shell);
        
        // 5초 후 조개 사라짐
        setTimeout(() => {
            if (shell.parentNode) {
                shell.style.animation = 'shellDisappear 0.5s ease-out forwards';
                setTimeout(() => {
                    if (shell.parentNode) {
                        beachArea.removeChild(shell);
                        const index = window.shellsData.indexOf(shell);
                        if (index > -1) {
                            window.shellsData.splice(index, 1);
                        }
                    }
                }, 500);
            }
        }, 5000);
    }
    
    // 정기적으로 조개 생성
    const shellInterval = setInterval(() => {
        if (window.shellsData.length < 8) {
            createShell();
        }
    }, 1000);
    
    // 게임 타이머
    const gameTimer = setInterval(() => {
        window.gameTime--;
        document.getElementById('timer').textContent = window.gameTime;
        
        if (window.gameTime <= 0) {
            endShellGame();
            clearInterval(gameTimer);
            clearInterval(shellInterval);
        }
    }, 1000);
    
    // 초기 조개들 생성
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createShell(), i * 500);
    }
    
    window.shellGameTimer = gameTimer;
    window.shellGameInterval = shellInterval;
}

function collectShellItem(shellElement, shellType) {
    // 수집 애니메이션
    shellElement.style.animation = 'shellCollect 0.5s ease-out forwards';
    
    // 수집 효과
    createShellCollectEffect(shellElement);
    
    window.shellCount++;
    document.getElementById('shell-count').textContent = window.shellCount;
    
    // 점수 및 음성
    const shellNames = {
        '🐚': '조개',
        '🦪': '굴',
        '🐌': '소라',
        '⭐': '불가사리',
        '🦀': '게'
    };
    
    speakTextFast(`${shellNames[shellType] || '조개'}를 찾았습니다`);
    addScore(50);
    
    // 조개 제거
    setTimeout(() => {
        if (shellElement.parentNode) {
            shellElement.parentNode.removeChild(shellElement);
            const index = window.shellsData.indexOf(shellElement);
            if (index > -1) {
                window.shellsData.splice(index, 1);
            }
        }
    }, 500);
    
    // 목표 달성 체크
    if (window.shellCount >= 20) {
        setTimeout(() => {
            endShellGame(true);
        }, 1000);
    }
}

function createShellCollectEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            width: 6px;
            height: 6px;
            background: ${['#FFD700', '#40E0D0', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 4)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10003;
            animation: collectParticle 1s ease-out forwards;
        `;
        
        // 랜덤 방향으로 날아가는 효과
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50;
        const endX = rect.left + rect.width/2 + Math.cos(angle) * distance;
        const endY = rect.top + rect.height/2 + Math.sin(angle) * distance;
        
        particle.style.setProperty('--end-x', endX + 'px');
        particle.style.setProperty('--end-y', endY + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

function endShellGame(completed = false) {
    if (window.shellGameTimer) {
        clearInterval(window.shellGameTimer);
    }
    if (window.shellGameInterval) {
        clearInterval(window.shellGameInterval);
    }
    
    const message = completed ? 
        `축하합니다! 모든 조개를 찾았습니다! 총 ${window.shellCount}개 수집!` : 
        `게임 끝! 총 ${window.shellCount}개의 조개를 수집했습니다!`;
    
    speakText(message);
    
    if (completed) {
        createConfetti();
        addScore(500);
    } else {
        addScore(window.shellCount * 10);
    }
    
    setTimeout(() => {
        closeShellCollection();
    }, 3000);
}

function closeShellCollection() {
    if (window.shellGameModal) {
        if (window.shellGameTimer) {
            clearInterval(window.shellGameTimer);
        }
        if (window.shellGameInterval) {
            clearInterval(window.shellGameInterval);
        }
        
        document.body.removeChild(window.shellGameModal);
        window.shellGameModal = null;
        window.shellsData = null;
    }
}

function listenToShells() {
    speakText('조개껍데기에 귀를 대면 바다 소리가 들려요');
    setTimeout(() => {
        speakText('쏴아아아');
    }, 2000);
}

function tellDadStory() {
    const dadStories = [
        '아빠는 예준이를 세상에서 가장 사랑해요',
        '아빠와 함께하는 시간이 가장 행복해요',
        '아빠가 들려주는 이야기는 언제나 재미있어요'
    ];
    
    const randomStory = dadStories[Math.floor(Math.random() * dadStories.length)];
    speakText(randomStory);
    createConfetti();
}

function viewFamilyPhotos() {
    speakText('가족과 함께 찍은 소중한 사진들을 보고 있어요');
    createConfetti();
}

function makeLaughterSounds() {
    speakText('하하하 호호호 히히히 즐거운 웃음소리');
    createConfetti();
}

function findHappyWords() {
    // 행복 관련 단어들로 특별 게임
    const happyWords = [
        { image: '😊', word: '웃음', options: ['웃음', '울음', '화남'] },
        { image: '🎉', word: '축하', options: ['축하', '슬픔', '걱정'] },
        { image: '❤️', word: '사랑', options: ['사랑', '미움', '무관심'] },
        { image: '🎁', word: '선물', options: ['선물', '벌', '숙제'] },
        { image: '🌈', word: '무지개', options: ['무지개', '비구름', '번개'] }
    ];
    
    startSpecialWordGame(happyWords, '행복 단어 찾기');
}

// 일기 저장 및 관리 기능들
function saveDiaryEntry(date, text) {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // localStorage에 일기 저장
    let diaryEntries = JSON.parse(localStorage.getItem('yejun-diary') || '{}');
    
    diaryEntries[dateKey] = {
        date: dateKey,
        text: text,
        timestamp: date.getTime()
    };
    
    localStorage.setItem('yejun-diary', JSON.stringify(diaryEntries));
    console.log('일기 저장됨:', dateKey, text);
}

function showDiaryList() {
    const diaryEntries = JSON.parse(localStorage.getItem('yejun-diary') || '{}');
    const entries = Object.values(diaryEntries).sort((a, b) => b.timestamp - a.timestamp);
    
    const listModal = document.createElement('div');
    listModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
    `;
    
    const listContent = document.createElement('div');
    listContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 20px;
        max-width: 600px;
        width: 90%;
        max-height: 80%;
        overflow-y: auto;
    `;
    
    let entriesHTML = '<h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">📖 예준이의 일기장</h2>';
    
    if (entries.length === 0) {
        entriesHTML += `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 3em; margin-bottom: 15px;">📝</div>
                <p style="font-size: 1.2em;">아직 작성된 일기가 없어요!</p>
                <p style="margin-top: 10px;">첫 번째 일기를 써보세요.</p>
            </div>
        `;
    } else {
        entries.forEach((entry, index) => {
            const date = new Date(entry.timestamp);
            const dateString = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
            
            entriesHTML += `
                <div style="
                    border: 2px solid #667eea;
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 15px;
                    background: linear-gradient(45deg, #f8f9ff, #fff);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong style="color: #667eea; font-size: 1.1em;">${dateString}</strong>
                        <button onclick="deleteDiaryEntry('${entry.date}')" style="
                            background: #ff6b6b;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            padding: 5px 10px;
                            cursor: pointer;
                            font-size: 0.8em;
                        ">삭제</button>
                    </div>
                    <div style="
                        font-size: 1.1em;
                        line-height: 1.6;
                        color: #333;
                        background: white;
                        padding: 15px;
                        border-radius: 10px;
                        border-left: 4px solid #667eea;
                    ">${entry.text}</div>
                </div>
            `;
        });
    }
    
    entriesHTML += `
        <div style="text-align: center; margin-top: 25px;">
            <button id="diary-list-close" style="
                background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 10px;
                font-size: 1.1em;
                cursor: pointer;
            ">닫기</button>
        </div>
    `;
    
    listContent.innerHTML = entriesHTML;
    listModal.appendChild(listContent);
    document.body.appendChild(listModal);
    
    document.getElementById('diary-list-close').addEventListener('click', () => {
        document.body.removeChild(listModal);
    });
    
    listModal.addEventListener('click', (e) => {
        if (e.target === listModal) {
            document.body.removeChild(listModal);
        }
    });
}

function deleteDiaryEntry(dateKey) {
    if (confirm('정말 이 일기를 삭제하시겠습니까?')) {
        let diaryEntries = JSON.parse(localStorage.getItem('yejun-diary') || '{}');
        delete diaryEntries[dateKey];
        localStorage.setItem('yejun-diary', JSON.stringify(diaryEntries));
        
        // 일기 목록 다시 보여주기
        const existingModal = document.querySelector('[style*="z-index: 10001"]');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        showDiaryList();
        
        speakTextFast('일기가 삭제되었습니다');
    }
}

// 특별 단어 게임 시작 함수 (해변, 가족 등)
let currentSpecialWords = [];
let originalWordGames = [];

function startSpecialWordGame(specialWords, gameName) {
    console.log(`${gameName} 시작!`);
    
    // 원래 단어 게임 백업
    if (originalWordGames.length === 0) {
        originalWordGames = [...wordGames];
    }
    
    // 특별 단어로 교체
    currentSpecialWords = [...specialWords];
    wordGames.length = 0; // 기존 배열 비우기
    wordGames.push(...specialWords); // 특별 단어만 추가
    
    // 단어 게임으로 이동하고 시작
    showGame('words');
    showRandomWord();
    
    // 게임 완료 후 원래 배열로 복원하는 함수 등록
    gameState.isSpecialMode = true;
    gameState.specialGameName = gameName;
    
    speakText(`${gameName}을 시작합니다`);
}

// 특별 게임 종료 함수
function endSpecialWordGame() {
    if (originalWordGames.length > 0) {
        wordGames.length = 0;
        wordGames.push(...originalWordGames);
        originalWordGames.length = 0;
    }
    
    gameState.isSpecialMode = false;
    gameState.specialGameName = '';
    currentSpecialWords.length = 0;
}

// 마우스 트레일 효과 제거됨

// 클릭 효과
function addClickEffects() {
    document.addEventListener('click', function(e) {
        createClickRipple(e.clientX, e.clientY);
    });
}

function createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,107,107,0.3))';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    ripple.style.animation = 'rippleEffect 0.6s ease-out forwards';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// 새로운 애니메이션을 CSS에 추가
function addInteractiveStyles() {
    if (!document.getElementById('interactive-styles')) {
        const style = document.createElement('style');
        style.id = 'interactive-styles';
        style.textContent = `
            @keyframes trailFade {
                0% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.3) rotate(180deg);
                }
            }
            
            @keyframes rippleEffect {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(20);
                }
            }
            
            @keyframes confettiFall {
                0% {
                    transform: translateY(-100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 획순 가이드 시스템 함수들
function initializeStrokeGuide() {
    console.log('획순 가이드 시스템 초기화 중...');
    
    // 가이드 캔버스 초기화
    guideCanvas = document.getElementById('stroke-guide-canvas');
    if (guideCanvas) {
        guideCtx = guideCanvas.getContext('2d');
        guideCtx.lineCap = 'round';
        guideCtx.lineJoin = 'round';
        console.log('자음 가이드 캔버스 초기화 완료');
    } else {
        console.log('자음 가이드 캔버스를 찾을 수 없습니다');
    }

    vowelGuideCanvas = document.getElementById('vowel-guide-canvas');
    if (vowelGuideCanvas) {
        vowelGuideCtx = vowelGuideCanvas.getContext('2d');
        vowelGuideCtx.lineCap = 'round';
        vowelGuideCtx.lineJoin = 'round';
        console.log('모음 가이드 캔버스 초기화 완료');
    } else {
        console.log('모음 가이드 캔버스를 찾을 수 없습니다');
    }

    // 초기 획순 표시 (약간의 지연을 두어 DOM이 완전히 로드된 후 실행)
    setTimeout(() => {
        updateConsonantStrokeInfo();
        updateVowelStrokeInfo();
        showCurrentConsonantStroke();
        showCurrentVowelStroke();
        console.log('초기 획순 가이드 표시 완료');
    }, 200);
}

// 현재 자음의 획순 정보 업데이트
function updateConsonantStrokeInfo() {
    const currentChar = gameState.currentConsonant;
    const strokeInfo = strokeData.consonants[currentChar];
    
    if (strokeInfo) {
        const currentStrokeNum = strokeGuideState.consonant.currentStroke + 1;
        const totalStrokes = strokeInfo.strokes.length;
        
        const nameElement = document.getElementById('consonant-name');
        const orderElement = document.getElementById('stroke-order');
        const directionElement = document.getElementById('stroke-direction');
        
        if (nameElement) nameElement.textContent = strokeInfo.description;
        if (orderElement) orderElement.textContent = `획순: ${currentStrokeNum}/${totalStrokes}`;
        
        if (strokeGuideState.consonant.currentStroke < strokeInfo.strokes.length) {
            const currentStroke = strokeInfo.strokes[strokeGuideState.consonant.currentStroke];
            if (directionElement) directionElement.textContent = `방향: ${currentStroke.direction}`;
        }
    }
}

// 현재 모음의 획순 정보 업데이트
function updateVowelStrokeInfo() {
    const currentChar = gameState.currentVowel;
    const strokeInfo = strokeData.vowels[currentChar];
    
    if (strokeInfo) {
        const currentStrokeNum = strokeGuideState.vowel.currentStroke + 1;
        const totalStrokes = strokeInfo.strokes.length;
        
        const nameElement = document.getElementById('vowel-name');
        const orderElement = document.getElementById('vowel-stroke-order');
        const directionElement = document.getElementById('vowel-stroke-direction');
        
        if (nameElement) nameElement.textContent = strokeInfo.description;
        if (orderElement) orderElement.textContent = `획순: ${currentStrokeNum}/${totalStrokes}`;
        
        if (strokeGuideState.vowel.currentStroke < strokeInfo.strokes.length) {
            const currentStroke = strokeInfo.strokes[strokeGuideState.vowel.currentStroke];
            if (directionElement) directionElement.textContent = `방향: ${currentStroke.direction}`;
        }
    }
}

// 자음 획순 가이드 표시
function showCurrentConsonantStroke() {
    console.log('showCurrentConsonantStroke 호출됨');
    console.log('guideCtx:', !!guideCtx, 'guideEnabled:', strokeGuideState.consonant.guideEnabled);
    
    if (!guideCtx || !strokeGuideState.consonant.guideEnabled) {
        console.log('가이드 표시 조건 불충족');
        return;
    }
    
    const currentChar = gameState.currentConsonant;
    const strokeInfo = strokeData.consonants[currentChar];
    
    console.log('현재 글자:', currentChar, '획순 정보 존재:', !!strokeInfo);
    
    if (!strokeInfo) {
        console.log('획순 정보 없음');
        return;
    }
    
    // 가이드 캔버스 클리어
    guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
    console.log('캔버스 클리어 완료, 크기:', guideCanvas.width, 'x', guideCanvas.height);
    
    // 현재 그려야 할 획만 화살표 패턴으로 표시
    if (strokeGuideState.consonant.currentStroke < strokeInfo.strokes.length) {
        const currentStroke = strokeInfo.strokes[strokeGuideState.consonant.currentStroke];
        console.log('화살표 패턴 그리기 시작, 획번호:', strokeGuideState.consonant.currentStroke + 1);
        drawArrowPattern(guideCtx, currentStroke.path, strokeGuideState.consonant.currentStroke + 1);
        console.log('화살표 패턴 그리기 완료');
    } else {
        console.log('현재 획이 전체 획수를 초과함');
    }
}

// 모음 획순 가이드 표시
function showCurrentVowelStroke() {
    if (!vowelGuideCtx || !strokeGuideState.vowel.guideEnabled) return;
    
    const currentChar = gameState.currentVowel;
    const strokeInfo = strokeData.vowels[currentChar];
    
    if (!strokeInfo) return;
    
    // 가이드 캔버스 클리어
    vowelGuideCtx.clearRect(0, 0, vowelGuideCanvas.width, vowelGuideCanvas.height);
    
    // 현재 그려야 할 획만 화살표 패턴으로 표시
    if (strokeGuideState.vowel.currentStroke < strokeInfo.strokes.length) {
        const currentStroke = strokeInfo.strokes[strokeGuideState.vowel.currentStroke];
        drawArrowPattern(vowelGuideCtx, currentStroke.path, strokeGuideState.vowel.currentStroke + 1);
    }
}

// 획 경로 그리기
function drawStrokePath(context, path) {
    if (path.length < 2) return;
    
    context.beginPath();
    context.moveTo(path[0][0], path[0][1]);
    
    for (let i = 1; i < path.length; i++) {
        context.lineTo(path[i][0], path[i][1]);
    }
    
    context.stroke();
}

// 시작점 표시
function drawStartPoint(context, x, y, strokeNumber) {
    context.save();
    
    // 외곽 빨간 원
    context.fillStyle = '#ff2222';
    context.beginPath();
    context.arc(x, y, 12, 0, 2 * Math.PI);
    context.fill();
    
    // 내부 흰색 원
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(x, y, 8, 0, 2 * Math.PI);
    context.fill();
    
    // 숫자 표시
    context.fillStyle = '#ff2222';
    context.font = 'bold 14px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(strokeNumber.toString(), x, y);
    
    // 반짝이는 효과
    context.strokeStyle = '#ffaaaa';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(x, y, 14, 0, 2 * Math.PI);
    context.stroke();
    
    context.restore();
}

// 점선 경로 그리기 (사용자가 따라 그릴 수 있도록)
function drawDottedPath(context, path) {
    console.log('drawDottedPath 호출됨, path:', path);
    if (path.length < 2) {
        console.log('경로가 너무 짧음');
        return;
    }
    
    context.save();
    
    // 점선 스타일 설정 (연한 청록색으로)
    context.strokeStyle = '#7FDBDA';
    context.lineWidth = 8; // 더 굵게
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.setLineDash([20, 15]); // 점선 패턴 (더 크게)
    context.globalAlpha = 1.0; // 완전 불투명하게
    
    console.log('점선 스타일 설정 완료:', context.strokeStyle, context.lineWidth);
    
    // 경로 그리기
    context.beginPath();
    context.moveTo(path[0][0], path[0][1]);
    console.log('시작점:', path[0]);
    
    for (let i = 1; i < path.length; i++) {
        context.lineTo(path[i][0], path[i][1]);
        console.log('라인 그리기 to:', path[i]);
    }
    
    context.stroke();
    console.log('점선 경로 stroke 완료');
    
    // 테스트용으로 원도 그려보기
    context.fillStyle = '#FF0000';
    context.beginPath();
    context.arc(path[0][0], path[0][1], 10, 0, 2 * Math.PI);
    context.fill();
    console.log('테스트 원 그리기 완료');
    
    context.restore();
}

// 화살표 패턴으로 획순 표시 (이미지와 같은 스타일 + 점선 경로)
function drawArrowPattern(context, path, strokeNumber) {
    console.log('drawArrowPattern 호출됨, 획번호:', strokeNumber, 'path 길이:', path.length);
    
    if (path.length < 2) {
        console.log('path가 너무 짧음');
        return;
    }
    
    context.save();
    
    // 새로운 캔버스 크기에 맞춰 좌표를 확대 (350x450 캔버스 기준)
    const canvasWidth = 350;
    const canvasHeight = 450;
    const scaleX = canvasWidth / 200; // 좌표 기준을 200으로 조정
    const scaleY = canvasHeight / 200;
    
    const scaledPath = path.map(point => [
        point[0] * scaleX + 50, // 여백 추가
        point[1] * scaleY + 100 // 수직 여백 추가
    ]);
    
    console.log('스케일링 완료, 첫 번째 점:', scaledPath[0], '마지막 점:', scaledPath[scaledPath.length - 1]);
    
    // 먼저 점선 경로 그리기 (배경)
    drawDottedPath(context, scaledPath);
    
    // 그 다음 화살표 패턴 그리기
    
    const [startX, startY] = scaledPath[0];
    const [endX, endY] = scaledPath[scaledPath.length - 1];
    
    // 벡터 계산
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length < 10) return;
    
    // 정규화
    const unitX = dx / length;
    const unitY = dy / length;
    
    // 시작점에 큰 빨간 원과 숫자
    context.fillStyle = '#e53e3e';
    context.beginPath();
    context.arc(startX, startY, 20, 0, 2 * Math.PI);
    context.fill();
    
    // 외곽선 추가
    context.strokeStyle = '#c53030';
    context.lineWidth = 3;
    context.stroke();
    
    // 숫자 표시 (더 큰 폰트)
    context.fillStyle = 'white';
    context.font = 'bold 22px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(strokeNumber.toString(), startX, startY);
    
    // 화살표들을 선을 따라 배치 (더 많이)
    const arrowCount = Math.max(3, Math.floor(length / 20)); // 최소 3개, 20픽셀마다
    
    for (let i = 1; i <= arrowCount; i++) {
        const t = i / (arrowCount + 1); // 0~1 사이 값
        
        // 선상의 위치 계산
        let currentX, currentY, dirX, dirY;
        if (scaledPath.length === 2) {
            // 직선인 경우
            currentX = startX + dx * t;
            currentY = startY + dy * t;
            dirX = unitX;
            dirY = unitY;
        } else {
            // 곡선인 경우 - 경로를 따라 계산
            const pathIndex = Math.floor(t * (scaledPath.length - 1));
            const nextIndex = Math.min(pathIndex + 1, scaledPath.length - 1);
            const localT = (t * (scaledPath.length - 1)) - pathIndex;
            
            currentX = scaledPath[pathIndex][0] + (scaledPath[nextIndex][0] - scaledPath[pathIndex][0]) * localT;
            currentY = scaledPath[pathIndex][1] + (scaledPath[nextIndex][1] - scaledPath[pathIndex][1]) * localT;
            
            // 해당 지점에서의 방향 계산
            const segmentDx = scaledPath[nextIndex][0] - scaledPath[pathIndex][0];
            const segmentDy = scaledPath[nextIndex][1] - scaledPath[pathIndex][1];
            const segmentLength = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy);
            dirX = segmentDx / segmentLength;
            dirY = segmentDy / segmentLength;
        }
        
        // 화살표 그리기 (더 큰 사이즈)
        drawChevronArrow(context, currentX, currentY, dirX, dirY);
    }
    
    context.restore();
}

// 갈매기표(>) 모양의 화살표 그리기 (더 크고 명확하게)
function drawChevronArrow(context, x, y, dirX, dirY) {
    const size = 15; // 더 큰 사이즈
    
    context.save();
    context.strokeStyle = '#e53e3e';
    context.lineWidth = 5; // 더 굵게
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // 화살표의 각도 계산
    const angle = Math.atan2(dirY, dirX);
    
    // 화살표 두 선 그리기 (더 뚜렷하게)
    context.beginPath();
    context.moveTo(
        x - size * Math.cos(angle - Math.PI/5),
        y - size * Math.sin(angle - Math.PI/5)
    );
    context.lineTo(x, y);
    context.lineTo(
        x - size * Math.cos(angle + Math.PI/5),
        y - size * Math.sin(angle + Math.PI/5)
    );
    context.stroke();
    
    // 그림자 효과 추가
    context.strokeStyle = 'rgba(197, 48, 48, 0.5)';
    context.lineWidth = 7;
    context.stroke();
    
    context.restore();
}

// 다음 획 보기
function showNextStroke() {
    console.log('showNextStroke 호출됨');
    
    const currentChar = gameState.currentConsonant;
    const strokeInfo = strokeData.consonants[currentChar];
    
    console.log('현재 글자:', currentChar, '획순 정보:', !!strokeInfo);
    
    if (!strokeInfo) {
        console.log('획순 정보 없음');
        return;
    }
    
    // 캔버스 요소 재확인
    const guideCanvasEl = document.getElementById('stroke-guide-canvas');
    if (!guideCanvasEl) {
        console.log('가이드 캔버스 요소를 찾을 수 없음');
        return;
    }
    
    const ctx = guideCanvasEl.getContext('2d');
    
    if (strokeGuideState.consonant.currentStroke < strokeInfo.strokes.length - 1) {
        strokeGuideState.consonant.currentStroke++;
        console.log('다음 획으로 이동:', strokeGuideState.consonant.currentStroke + 1);
    } else {
        strokeGuideState.consonant.currentStroke = 0;
        console.log('첫 번째 획으로 돌아감');
    }
    
    // 캔버스 클리어
    ctx.clearRect(0, 0, guideCanvasEl.width, guideCanvasEl.height);
    
    // 현재 획 그리기
    const currentStroke = strokeInfo.strokes[strokeGuideState.consonant.currentStroke];
    console.log('현재 획 그리기:', strokeGuideState.consonant.currentStroke + 1, currentStroke);
    drawArrowPattern(ctx, currentStroke.path, strokeGuideState.consonant.currentStroke + 1);
    
    // 음성으로 방향 안내
    speakText(`${strokeGuideState.consonant.currentStroke + 1}번째 획: ${currentStroke.direction}`);
}

// 다음 모음 획 보기
function showNextVowelStroke() {
    console.log('showNextVowelStroke 호출됨');
    
    const currentChar = gameState.currentVowel;
    const strokeInfo = strokeData.vowels[currentChar];
    
    console.log('현재 모음:', currentChar, '획순 정보:', !!strokeInfo);
    
    if (!strokeInfo) {
        console.log('모음 획순 정보 없음');
        return;
    }
    
    // 캔버스 요소 재확인
    const guideCanvasEl = document.getElementById('vowel-guide-canvas');
    if (!guideCanvasEl) {
        console.log('모음 가이드 캔버스 요소를 찾을 수 없음');
        return;
    }
    
    const ctx = guideCanvasEl.getContext('2d');
    
    if (strokeGuideState.vowel.currentStroke < strokeInfo.strokes.length - 1) {
        strokeGuideState.vowel.currentStroke++;
        console.log('다음 모음 획으로 이동:', strokeGuideState.vowel.currentStroke + 1);
    } else {
        strokeGuideState.vowel.currentStroke = 0;
        console.log('첫 번째 모음 획으로 돌아감');
    }
    
    // 캔버스 클리어
    ctx.clearRect(0, 0, guideCanvasEl.width, guideCanvasEl.height);
    
    // 현재 획 그리기
    const currentStroke = strokeInfo.strokes[strokeGuideState.vowel.currentStroke];
    console.log('현재 모음 획 그리기:', strokeGuideState.vowel.currentStroke + 1, currentStroke);
    drawArrowPattern(ctx, currentStroke.path, strokeGuideState.vowel.currentStroke + 1);
    
    // 음성으로 방향 안내
    speakText(`${strokeGuideState.vowel.currentStroke + 1}번째 획: ${currentStroke.direction}`);
}

// 획순 가이드 토글
function toggleStrokeGuide() {
    strokeGuideState.consonant.guideEnabled = !strokeGuideState.consonant.guideEnabled;
    const btn = document.getElementById('stroke-guide-btn');
    
    if (strokeGuideState.consonant.guideEnabled) {
        if (btn) btn.textContent = '획순 가이드 ON';
        showCurrentConsonantStroke();
        speakText('획순 가이드가 켜졌습니다');
    } else {
        if (btn) btn.textContent = '획순 가이드 OFF';
        if (guideCtx) guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
        speakText('획순 가이드가 꺼졌습니다');
    }
}

// 모음 획순 가이드 토글
function toggleVowelStrokeGuide() {
    strokeGuideState.vowel.guideEnabled = !strokeGuideState.vowel.guideEnabled;
    const btn = document.getElementById('vowel-guide-btn');
    
    if (strokeGuideState.vowel.guideEnabled) {
        if (btn) btn.textContent = '획순 가이드 ON';
        showCurrentVowelStroke();
        speakText('획순 가이드가 켜졌습니다');
    } else {
        if (btn) btn.textContent = '획순 가이드 OFF';
        if (vowelGuideCtx) vowelGuideCtx.clearRect(0, 0, vowelGuideCanvas.width, vowelGuideCanvas.height);
        speakText('획순 가이드가 꺼졌습니다');
    }
}

// 자음 선택 시 획순 가이드 업데이트
function selectConsonant(consonant) {
    console.log(`selectConsonant 호출됨: ${consonant}`);
    
    gameState.currentConsonant = consonant;
    document.getElementById('current-consonant').textContent = consonant;
    
    // 자음 이름 업데이트 (한글 이름과 영어 이름)
    const consonantName = document.getElementById('consonant-name');
    const consonantSubtitle = document.querySelector('.letter-subtitle');
    if (consonantName && strokeData.consonants[consonant]) {
        consonantName.textContent = strokeData.consonants[consonant].description;
    }
    if (consonantSubtitle && strokeData.consonants[consonant]) {
        consonantSubtitle.textContent = '[' + strokeData.consonants[consonant].english + ']';
    }
    
    // 선택 표시 업데이트
    const items = document.querySelectorAll('.consonant-item');
    items.forEach(item => {
        item.classList.remove('selected');
        if (item.textContent === consonant) {
            item.classList.add('selected');
        }
    });
    
    // 획순 가이드 강제 활성화
    console.log('획순 가이드 강제 활성화');
    strokeGuideState.consonant.guideEnabled = true;
    strokeGuideState.consonant.currentStroke = 0;
    strokeGuideState.consonant.strokeComplete = false;
    
    // 캔버스 재초기화
    console.log('캔버스 재초기화 시작');
    const guideCanvasEl = document.getElementById('stroke-guide-canvas');
    const writingCanvasEl = document.getElementById('writing-canvas');
    
    if (guideCanvasEl && writingCanvasEl) {
        guideCtx = guideCanvasEl.getContext('2d');
        writingCtx = writingCanvasEl.getContext('2d');
        
        console.log('컨텍스트 재설정 완료');
        
        // 캔버스 클리어
        guideCtx.clearRect(0, 0, guideCanvasEl.width, guideCanvasEl.height);
        writingCtx.clearRect(0, 0, writingCanvasEl.width, writingCanvasEl.height);
        
        // 가이드 즉시 표시
        console.log('가이드 즉시 표시 시작');
        const strokeInfo = strokeData.consonants[consonant];
        if (strokeInfo && strokeInfo.strokes.length > 0) {
            const firstStroke = strokeInfo.strokes[0];
            console.log('첫 번째 획 그리기:', firstStroke);
            console.log('캔버스 크기:', guideCanvasEl.width, 'x', guideCanvasEl.height);
            console.log('캔버스 컨텍스트:', !!guideCtx);
            
            // 강제로 테스트 그리기 먼저
            guideCtx.fillStyle = 'red';
            guideCtx.fillRect(10, 10, 50, 50);
            console.log('테스트 빨간 사각형 그리기 완료');
            
            // 실제 화살표 패턴 그리기
            drawArrowPattern(guideCtx, firstStroke.path, 1);
        } else {
            console.log('획순 정보 없음 또는 빈 배열');
        }
    } else {
        console.log('캔버스 요소를 찾을 수 없음');
    }
    
    // 소리 재생
    speakText(strokeData.consonants[consonant]?.pronunciation || consonant);
    addScore(10);
    
    // 새로운 캔버스에 그리기 이벤트 리스너 추가
    setupDrawingCanvas();
    
    // 강제로 간단한 테스트 그리기
    forceDrawTest();
}

// 강제 테스트 그리기 함수
function forceDrawTest() {
    console.log('강제 테스트 시작');
    
    // 1초 후에 실행 (다른 초기화가 완료된 후)
    setTimeout(() => {
        const canvas1 = document.getElementById('stroke-guide-canvas');
        const canvas2 = document.getElementById('writing-canvas');
        
        console.log('테스트 캔버스들:', !!canvas1, !!canvas2);
        
        if (canvas1) {
            const ctx1 = canvas1.getContext('2d');
            
            console.log('캔버스 실제 크기:', canvas1.offsetWidth, 'x', canvas1.offsetHeight);
            console.log('캔버스 스타일:', window.getComputedStyle(canvas1).display);
            console.log('캔버스 위치:', canvas1.getBoundingClientRect());
            
            // 캔버스 배경을 노란색으로 채우기
            ctx1.fillStyle = 'yellow';
            ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
            console.log('노란 배경 그리기 완료');
            
            // 빨간 사각형 그리기 (큰 사이즈로)
            ctx1.fillStyle = 'red';
            ctx1.fillRect(10, 10, 200, 200);
            console.log('빨간 사각형 그리기 완료');
            
            // 파란 원 그리기 (큰 사이즈로)
            ctx1.fillStyle = 'blue';
            ctx1.beginPath();
            ctx1.arc(250, 250, 80, 0, 2 * Math.PI);
            ctx1.fill();
            console.log('파란 원 그리기 완료');
            
            // 굵은 초록 선 그리기
            ctx1.strokeStyle = 'green';
            ctx1.lineWidth = 15;
            ctx1.setLineDash([]);
            ctx1.beginPath();
            ctx1.moveTo(10, 350);
            ctx1.lineTo(340, 350);
            ctx1.stroke();
            console.log('초록 선 그리기 완료');
            
            console.log('강제 테스트 그리기 완료!');
        } else {
            console.log('stroke-guide-canvas를 찾을 수 없음');
        }
    }, 1000);
}

// 새로운 노트북 레이아웃 캔버스를 위한 그리기 설정
function setupDrawingCanvas() {
    console.log('setupDrawingCanvas 호출됨');
    
    const writingCanvas = document.getElementById('writing-canvas');
    if (!writingCanvas) {
        console.log('writing-canvas 요소를 찾을 수 없음');
        return;
    }
    
    console.log('writing-canvas 찾음, 그리기 설정 시작');
    
    const ctx = writingCanvas.getContext('2d');
    
    // 점선 스타일 강제 설정
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([12, 8]); // 점선 패턴 (더 명확하게)
    
    console.log('캔버스 스타일 설정 완료:', ctx.strokeStyle, ctx.lineWidth);
    
    // 전역 변수로 저장
    window.currentDrawingCanvas = writingCanvas;
    window.currentDrawingCtx = ctx;
    window.isDrawingActive = false;
    
    // 기존 이벤트 리스너 모두 제거
    const newCanvas = writingCanvas.cloneNode(true);
    writingCanvas.parentNode.replaceChild(newCanvas, writingCanvas);
    
    // 새로운 캔버스 컨텍스트 다시 가져오기
    const newCtx = newCanvas.getContext('2d');
    newCtx.strokeStyle = '#2E8B57';  // 사용자 그리기는 실선 (짙은 초록)
    newCtx.lineWidth = 4;
    newCtx.lineCap = 'round';
    newCtx.lineJoin = 'round';
    newCtx.setLineDash([]); // 실선으로 변경
    
    // 간단한 이벤트 리스너
    function startDraw(e) {
        console.log('그리기 시작');
        window.isDrawingActive = true;
        const rect = newCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        newCtx.beginPath();
        newCtx.moveTo(x, y);
        
        // 그리기 시작점 설정
    }
    
    function draw(e) {
        if (!window.isDrawingActive) return;
        
        const rect = newCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        console.log('그리기 중:', x, y);
        
        newCtx.lineTo(x, y);
        newCtx.stroke();
    }
    
    function stopDraw() {
        console.log('그리기 종료');
        window.isDrawingActive = false;
    }
    
    // 이벤트 리스너 등록
    newCanvas.addEventListener('mousedown', startDraw);
    newCanvas.addEventListener('mousemove', draw);
    newCanvas.addEventListener('mouseup', stopDraw);
    newCanvas.addEventListener('mouseleave', stopDraw);
    
    console.log('이벤트 리스너 등록 완료');
}

// 모음 캔버스를 위한 그리기 설정
function setupVowelDrawingCanvas() {
    console.log('setupVowelDrawingCanvas 호출됨');
    
    const writingCanvas = document.getElementById('vowel-canvas');
    if (!writingCanvas) {
        console.log('vowel-canvas 요소를 찾을 수 없음');
        return;
    }
    
    console.log('vowel-canvas 찾음, 그리기 설정 시작');
    
    // 기존 이벤트 리스너 모두 제거
    const newCanvas = writingCanvas.cloneNode(true);
    writingCanvas.parentNode.replaceChild(newCanvas, writingCanvas);
    
    // 새로운 캔버스 컨텍스트 다시 가져오기
    const newCtx = newCanvas.getContext('2d');
    newCtx.strokeStyle = '#B22222';  // 사용자 그리기는 실선 (짙은 빨강)
    newCtx.lineWidth = 4;
    newCtx.lineCap = 'round';
    newCtx.lineJoin = 'round';
    newCtx.setLineDash([]); // 실선으로 변경
    
    console.log('모음 캔버스 스타일 설정 완료:', newCtx.strokeStyle);
    
    // 간단한 이벤트 리스너
    function startDraw(e) {
        console.log('모음 그리기 시작');
        window.isVowelDrawingActive = true;
        const rect = newCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        newCtx.beginPath();
        newCtx.moveTo(x, y);
        
        // 그리기 시작점 설정
    }
    
    function draw(e) {
        if (!window.isVowelDrawingActive) return;
        
        const rect = newCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        console.log('모음 그리기 중:', x, y);
        
        newCtx.lineTo(x, y);
        newCtx.stroke();
    }
    
    function stopDraw() {
        console.log('모음 그리기 종료');
        window.isVowelDrawingActive = false;
    }
    
    // 이벤트 리스너 등록
    newCanvas.addEventListener('mousedown', startDraw);
    newCanvas.addEventListener('mousemove', draw);
    newCanvas.addEventListener('mouseup', stopDraw);
    newCanvas.addEventListener('mouseleave', stopDraw);
    
    console.log('모음 이벤트 리스너 등록 완료');
}

// 모음 선택 시 획순 가이드 업데이트  
function selectVowel(vowel) {
    console.log(`selectVowel 호출됨: ${vowel}`);
    
    gameState.currentVowel = vowel;
    document.getElementById('current-vowel').textContent = vowel;
    
    // 모음 이름 업데이트 (한글 이름과 영어 이름)
    const vowelName = document.getElementById('vowel-name');
    const vowelSubtitle = document.querySelector('#vowels-game .letter-subtitle');
    if (vowelName && strokeData.vowels[vowel]) {
        vowelName.textContent = strokeData.vowels[vowel].description;
    }
    if (vowelSubtitle && strokeData.vowels[vowel]) {
        vowelSubtitle.textContent = '[' + strokeData.vowels[vowel].english + ']';
    }
    
    // 선택 표시 업데이트
    const items = document.querySelectorAll('.vowel-item');
    items.forEach(item => {
        item.classList.remove('selected');
        if (item.textContent === vowel) {
            item.classList.add('selected');
        }
    });
    
    // 획순 가이드 강제 활성화
    console.log('모음 획순 가이드 강제 활성화');
    strokeGuideState.vowel.guideEnabled = true;
    strokeGuideState.vowel.currentStroke = 0;
    strokeGuideState.vowel.strokeComplete = false;
    
    // 캔버스 재초기화
    console.log('모음 캔버스 재초기화 시작');
    const guideCanvasEl = document.getElementById('vowel-guide-canvas');
    const writingCanvasEl = document.getElementById('vowel-canvas');
    
    if (guideCanvasEl && writingCanvasEl) {
        vowelGuideCtx = guideCanvasEl.getContext('2d');
        vowelCtx = writingCanvasEl.getContext('2d');
        
        console.log('모음 컨텍스트 재설정 완료');
        
        // 캔버스 클리어
        vowelGuideCtx.clearRect(0, 0, guideCanvasEl.width, guideCanvasEl.height);
        vowelCtx.clearRect(0, 0, writingCanvasEl.width, writingCanvasEl.height);
        
        // 가이드 즉시 표시
        console.log('모음 가이드 즉시 표시 시작');
        const strokeInfo = strokeData.vowels[vowel];
        if (strokeInfo && strokeInfo.strokes.length > 0) {
            const firstStroke = strokeInfo.strokes[0];
            console.log('첫 번째 모음 획 그리기:', firstStroke);
            drawArrowPattern(vowelGuideCtx, firstStroke.path, 1);
        }
    } else {
        console.log('모음 캔버스 요소를 찾을 수 없음');
    }
    
    // 소리 재생
    speakText(strokeData.vowels[vowel]?.pronunciation || vowel);
    addScore(10);
    
    // 모음 캔버스에도 그리기 이벤트 리스너 추가
    setupVowelDrawingCanvas();
    
    // 정보 및 가이드 업데이트
    updateVowelStrokeInfo();
    
    // 캔버스 클리어
    clearVowelCanvas();
    
    // 가이드 표시 (약간의 지연을 두어 캔버스가 클리어된 후 표시)
    setTimeout(() => {
        showCurrentVowelStroke();
    }, 50);
    
    // 소리 재생
    speakText(strokeData.vowels[vowel]?.pronunciation || vowel);
}

// 다음 자음으로 넘어가기
function nextConsonant() {
    const currentIndex = consonants.indexOf(gameState.currentConsonant);
    const nextIndex = (currentIndex + 1) % consonants.length;
    selectConsonant(consonants[nextIndex]);
    addScore(10);
}

// 다음 모음으로 넘어가기
function nextVowel() {
    const currentIndex = vowels.indexOf(gameState.currentVowel);
    const nextIndex = (currentIndex + 1) % vowels.length;
    selectVowel(vowels[nextIndex]);
    addScore(10);
}

// 게임 초기화 완료 메시지
setTimeout(() => {
    console.log('초기화 시작...');
    
    // 메뉴 버튼 이벤트 리스너 확인
    const menuButtons = document.querySelectorAll('.menu-btn');
    console.log('메뉴 버튼 개수:', menuButtons.length);
    
    menuButtons.forEach((btn, index) => {
        console.log(`버튼 ${index + 1}:`, btn.textContent, 'onclick:', !!btn.onclick);
    });
    
    // showGame 함수 존재 확인
    console.log('showGame 함수 존재:', typeof showGame);
    
    addInteractiveStyles();
    console.log('예준이의 한글나라에 오신 것을 환영합니다! 🎉');
    
    // 획순 가이드 시스템 재초기화
    console.log('획순 가이드 시스템 재초기화');
    initializeStrokeGuide();
    
    // 캔버스 상태 확인
    console.log('캔버스 상태 재확인');
    const guideCanvasCheck = document.getElementById('stroke-guide-canvas');
    const writingCanvasCheck = document.getElementById('writing-canvas');
    console.log('guideCanvas 존재:', !!guideCanvasCheck);
    console.log('writingCanvas 존재:', !!writingCanvasCheck);
    
    if (guideCanvasCheck) {
        console.log('가이드 캔버스 크기:', guideCanvasCheck.width, 'x', guideCanvasCheck.height);
    }
    
    // 강제로 획순 가이드 표시
    console.log('강제로 획순 가이드 표시 시작');
    setTimeout(() => {
        if (document.querySelector('#consonants-game.active')) {
            console.log('자음 게임이 활성화되어 있음, 가이드 표시');
            selectConsonant('ㄱ');
        }
        if (document.querySelector('#vowels-game.active')) {
            console.log('모음 게임이 활성화되어 있음, 가이드 표시');
            selectVowel('ㅏ');
        }
    }, 500);
    
    // 환영 메시지에서만 색종이 효과
    createConfetti();
}, 1200);

// 모든 전역 함수들 등록 (HTML onclick에서 접근 가능하도록)
window.showGame = showGame;
window.selectConsonant = selectConsonant;
window.selectVowel = selectVowel;
window.showNextStroke = showNextStroke;
window.showNextVowelStroke = showNextVowelStroke;
window.clearCanvas = clearCanvas;
window.clearVowelCanvas = clearVowelCanvas;
window.playSound = playSound;
window.nextConsonant = nextConsonant;
window.nextVowel = nextVowel;
window.selectWord = selectWord;
window.nextWord = nextWord;
window.selectPart = selectPart;
window.checkSyllable = checkSyllable;
window.exploreWordTag = exploreWordTag;
window.startMemoryWordGame = startMemoryWordGame;
window.writeMemoryStory = writeMemoryStory;
window.familyWordChallenge = familyWordChallenge;
window.setupDrawingCanvas = setupDrawingCanvas;
window.setupVowelDrawingCanvas = setupVowelDrawingCanvas;
window.forceDrawTest = forceDrawTest;