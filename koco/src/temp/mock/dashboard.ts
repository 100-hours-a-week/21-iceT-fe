import { IGetUserDashboardResponse } from '@/@types/user';

const MOCK_DASHBOARD_DATA: IGetUserDashboardResponse = {
  userId: 1,
  nickname: '지연우',
  statusMessage: '솔브닥 스트릭 100일 채우자',
  profileImgUrl: '../../../assets/defaultProfileImage.png',
  todayProblemSetId: 1,
  continuousAttendance: 5,
  studyStats: [
    {
      categoryId: 1,
      categoryName: 'DP',
      correctRate: 92.5,
    },
    {
      categoryId: 3,
      categoryName: '구현',
      correctRate: 87.0,
    },
    {
      categoryId: 2,
      categoryName: '그래프',
      correctRate: 84.2,
    },
    {
      categoryId: 5,
      categoryName: '탐색',
      correctRate: 80.6,
    },
    {
      categoryId: 4,
      categoryName: '정렬',
      correctRate: 79.9,
    },
  ],
};

export default MOCK_DASHBOARD_DATA;
