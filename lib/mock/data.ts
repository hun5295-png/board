// Mock 데이터 - 실제 Supabase 연결 없이 데모 실행을 위한 데이터

export const mockCategories = [
  {
    id: '1',
    name: '공지사항',
    slug: 'notice',
    description: '회사 공지사항을 게시하는 게시판입니다.',
    is_anonymous: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '업무공유',
    slug: 'work-share',
    description: '업무 관련 정보를 공유하는 게시판입니다.',
    is_anonymous: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '자유게시판',
    slug: 'free-board',
    description: '자유롭게 소통하는 게시판입니다.',
    is_anonymous: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: '익명게시판(느티나무)',
    slug: 'anonymous',
    description: '익명으로 소통하는 게시판입니다.',
    is_anonymous: true,
    created_at: '2024-01-01T00:00:00Z'
  }
]

export const mockPosts = [
  {
    id: '1',
    title: '직원 전용 게시판 오픈 안내',
    content: '안녕하세요!\n\n새로운 직원 전용 게시판이 오픈되었습니다.\n\n주요 기능:\n- 카테고리별 게시글 작성\n- 실시간 댓글\n- 익명 게시판 지원\n- 파일 첨부\n\n많은 이용 바랍니다.',
    category_id: '1',
    author_id: 'admin',
    is_anonymous: false,
    view_count: 156,
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-01T09:00:00Z',
    profiles: {
      full_name: '관리자',
      email: 'admin@company.com'
    }
  },
  {
    id: '2',
    title: '프로젝트 진행 상황 공유',
    content: '현재 진행 중인 프로젝트들의 상황을 공유드립니다.\n\n1. 웹사이트 리뉴얼: 80% 완료\n2. 모바일 앱 개발: 60% 완료\n3. 새로운 기능 추가: 계획 단계\n\n질문이나 의견이 있으시면 댓글로 남겨주세요.',
    category_id: '2',
    author_id: 'user1',
    is_anonymous: false,
    view_count: 89,
    created_at: '2024-01-02T14:30:00Z',
    updated_at: '2024-01-02T14:30:00Z',
    profiles: {
      full_name: '김개발',
      email: 'kim@company.com'
    }
  },
  {
    id: '3',
    title: '점심 메뉴 추천해주세요!',
    content: '오늘 점심 뭘 먹을지 고민입니다.\n회사 근처 맛집 추천 부탁드려요~\n\n개인적으로는 한식을 선호합니다!',
    category_id: '3',
    author_id: 'user2',
    is_anonymous: false,
    view_count: 45,
    created_at: '2024-01-03T11:45:00Z',
    updated_at: '2024-01-03T11:45:00Z',
    profiles: {
      full_name: '이직원',
      email: 'lee@company.com'
    }
  },
  {
    id: '4',
    title: '회사 분위기 어떻게 생각하시나요?',
    content: '요즘 회사 분위기가 어떤지 솔직한 의견을 듣고 싶습니다.\n\n개선이 필요한 부분이나 좋은 점들을 자유롭게 이야기해주세요.',
    category_id: '4',
    author_id: 'anonymous1',
    is_anonymous: true,
    view_count: 234,
    created_at: '2024-01-04T16:20:00Z',
    updated_at: '2024-01-04T16:20:00Z'
  }
]

export const mockComments = [
  {
    id: '1',
    content: '새로운 게시판 정말 좋네요! 많이 활용하겠습니다.',
    post_id: '1',
    author_id: 'user1',
    parent_id: null,
    is_anonymous: false,
    created_at: '2024-01-01T10:15:00Z',
    updated_at: '2024-01-01T10:15:00Z',
    profiles: {
      full_name: '김개발',
      email: 'kim@company.com'
    }
  },
  {
    id: '2',
    content: '수고하셨습니다!',
    post_id: '2',
    author_id: 'user2',
    parent_id: null,
    is_anonymous: false,
    created_at: '2024-01-02T15:00:00Z',
    updated_at: '2024-01-02T15:00:00Z',
    profiles: {
      full_name: '이직원',
      email: 'lee@company.com'
    }
  },
  {
    id: '3',
    content: '회사 근처 김치찌개 집 추천드려요! 정말 맛있어요.',
    post_id: '3',
    author_id: 'user1',
    parent_id: null,
    is_anonymous: false,
    created_at: '2024-01-03T12:00:00Z',
    updated_at: '2024-01-03T12:00:00Z',
    profiles: {
      full_name: '김개발',
      email: 'kim@company.com'
    }
  },
  {
    id: '4',
    content: '전반적으로 괜찮다고 생각해요. 다만 소통이 더 활발해졌으면 좋겠네요.',
    post_id: '4',
    author_id: 'anonymous2',
    parent_id: null,
    is_anonymous: true,
    created_at: '2024-01-04T17:00:00Z',
    updated_at: '2024-01-04T17:00:00Z'
  }
]

export const mockUser = {
  id: 'demo-user',
  email: 'demo@company.com',
  user_metadata: {
    full_name: '데모 사용자'
  }
}

export const mockEmployees = [
  {
    id: '1',
    employee_id: '2',
    name: '김상균',
    department: '외국',
    position: '팀장',
    email: 'kim@company.com',
    phone: '010-1234-5678',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    employee_id: '163',
    name: '서정에',
    department: '약지과',
    position: '대리',
    email: 'seo@company.com',
    phone: '010-2345-6789',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    employee_id: '267',
    name: '백두심',
    department: '임상병리실',
    position: '과장',
    email: 'baek@company.com',
    phone: '010-3456-7890',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    employee_id: '549',
    name: '차제우',
    department: '원무',
    position: '대리',
    email: 'cha@company.com',
    phone: '010-4567-8901',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    employee_id: '1237',
    name: '구선화',
    department: '건강증진센터',
    position: '부장',
    email: 'gu@company.com',
    phone: '010-5678-9012',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    employee_id: '1509',
    name: '김민혜',
    department: '5층상급',
    position: '과장',
    email: 'kimmin@company.com',
    phone: '010-6789-0123',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    employee_id: '1750',
    name: '박용주',
    department: 'SEROUM',
    position: '대리',
    email: 'park@company.com',
    phone: '010-7890-1234',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    employee_id: '1831',
    name: '최평택',
    department: '방사선실',
    position: '과장',
    email: 'choi@company.com',
    phone: '010-8901-2345',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '9',
    employee_id: '9347',
    name: '이다림',
    department: '임상병리실',
    position: '대리',
    email: 'lee@company.com',
    phone: '010-9012-3456',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    employee_id: '9440',
    name: '최다빈',
    department: '원무',
    position: '대리',
    email: 'choi2@company.com',
    phone: '010-0123-4567',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '11',
    employee_id: '9513',
    name: '류정은',
    department: '심사',
    position: '과장',
    email: 'ryu@company.com',
    phone: '010-1234-5679',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '12',
    employee_id: '9561',
    name: '공민지',
    department: '방사선실',
    position: '대리',
    email: 'gong@company.com',
    phone: '010-2345-6780',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '13',
    employee_id: '9580',
    name: '이경애',
    department: '진료협력센터',
    position: '부장',
    email: 'leek@company.com',
    phone: '010-3456-7891',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]






