import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Smile } from 'lucide-react';

const EmojiPickerComponent = ({ onEmojiClick, isOpen, onClose }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    setShowPicker(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
        onClose();
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPicker, onClose]);

  const handleEmojiClick = (emojiData) => {
    onEmojiClick(emojiData.emoji);
    setShowPicker(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowPicker(false);
      onClose();
    }
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={togglePicker}
        className="btn btn-ghost btn-sm p-2 hover:bg-base-300 rounded-lg transition-colors"
        title="Add emoji"
      >
        <Smile className="w-5 h-5" />
      </button>
      
      {showPicker && (
        <div className="absolute bottom-full right-0 mb-2 z-50">
          <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 overflow-hidden">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={300}
              height={350}
              searchDisabled={false}
              skinTonesDisabled={false}
              previewConfig={{
                showPreview: true,
                defaultEmoji: '1f60a',
                defaultCaption: 'Choose an emoji'
              }}
              theme="auto"
              lazyLoadEmojis={true}
              emojiStyle="native"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;
