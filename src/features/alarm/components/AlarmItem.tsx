import { useNavigate } from 'react-router-dom';
import useConfirmAlarm from '../hooks/useConfirmAlarm';
import { Alarm } from '../types/alarm';
import { getNotificationIcon } from '../utils/getNotificationIcon';
import { getAlarmMessage } from '../utils/getAlarmMessage';
import { formatDate } from '@/shared/utils/formatDate';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';

const AlarmItem = (alarm: Alarm) => {
  const navigate = useNavigate();
  const AlarmConfirmMutation = useConfirmAlarm();
  const queryClient = useQueryClient();
  const handleAlarmClick = (postId: number, alarmId: number) => {
    try {
      AlarmConfirmMutation.mutate(
        { alarmId, userId: alarm.receiverId },
        {
          onSuccess: () => {
            navigate(`/post/${postId}`);
            queryClient.refetchQueries({
              queryKey: [...queryKeys.alarm.all, 'count-only', alarm.receiverId],
            });
          },
        }
      );
    } catch {
      alert('존재하지 않는 알람입니다');
    }
  };

  return (
    <div
      onClick={() => handleAlarmClick(alarm.postId, alarm.id)}
      className={`
                  p-4 rounded-lg border cursor-pointer transition-colors
                  bg-blue-50 border-blue-200
                  hover:bg-gray-50
                `}
    >
      <div className="flex items-start gap-3">
        {/* 알람 아이콘 */}
        <div className="flex-shrink-0 text-xl">{getNotificationIcon(alarm.alarmType)}</div>

        {/* 알람 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm text-gray-900">{getAlarmMessage(alarm)}</h3>

            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
          </div>
          <p className="text-xs text-gray-400 mt-1">{formatDate(alarm.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default AlarmItem;
