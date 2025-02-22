import { Send } from 'lucide-react'
import React from 'react'

function ChatbotTextfield() {
    return (
        <div className="border-t p-4 sticky bottom-0">
            <div className="flex gap-4">
                <input
                    type="text"
                    ref={inputRef}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="input input-bordered flex-1 text-base-content"
                />
                <button
                    onClick={handleSendMessage}
                    className="btn btn-primary"
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}

export default ChatbotTextfield