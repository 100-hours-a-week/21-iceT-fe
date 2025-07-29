import { formatDate } from '@/shared/utils/formatDate';
import { ChatSession } from '../types/chatSession';
import feedbackIc from '@/assets/feedbackIc.svg';
import interviewIc from '@/assets/interviewIc.svg';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';

interface ISessionItemProps {
  session: ChatSession;
  isSelected: boolean;
  onSelect: (sessionId: number) => void;
  isSelectionMode: boolean;
}

const SessionItem = ({ session, isSelected, onSelect, isSelectionMode }: ISessionItemProps) => {
  const navigate = useNavigate();
  const handleNavigateChattingRoom = () => {
    if (!isSelectionMode) {
      navigate(`/chatbot/${session.sessionId}`, { state: { session: true } });
    }
  };

  return (
    <div
      onClick={handleNavigateChattingRoom}
      className="flex items-center justify-between py-3 px-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1">
        {isSelectionMode && (
          <div className="flex-shrink-0">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'
              }`}
              onClick={() => onSelect(session.sessionId)}
            >
              {isSelected && <span className="text-white text-xs">&#10003;</span>}
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="text-lg font-medium text-gray-900 mb-1">{session.title}</div>
          <div className="text-sm text-gray-600"> {formatDate(session.createdAt)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          {session.mode === 'feedback' ? <img src={feedbackIc} /> : <img src={interviewIc} />}
        </button>
      </div>
    </div>
  );
};

export default memo(SessionItem);
