import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
interface RatingModalProps {
  isOpen: any;
  onClose: any;
  onSubmit: any;
}
const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 m-4"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold mb-6">Đánh giá sự kiện</h3>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hover || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Chia sẻ trải nghiệm của bạn về sự kiện này..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[100px] p-3 border rounded-lg"
              />

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-4 py-2"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    onSubmit({ rating, comment });
                    onClose();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={!rating}
                >
                  Gửi đánh giá
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TicketCard : React.FC<{ ticket: any; onOpenDetails: any }> = ({ ticket, onOpenDetails }) => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ticketRating, setTicketRating] = useState(ticket.rating || 0);

  const handleRatingSubmit = ({ rating, comment }: { rating: any; comment: any }) => {
    setTicketRating(rating);
    // Here you would typically make an API call to save the rating
    console.log('Rating submitted:', { ticketId: ticket.id, rating, comment });
  };
 
  const handleStarClick = (e:any) => {
    e.stopPropagation(); // Prevent card click event
    setIsRatingModalOpen(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 bg-white/90 backdrop-blur-sm"
        onClick={onOpenDetails}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={ticket.image}
              alt={ticket.name}
              className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Status badge */}
            {/* <div className={`absolute left-4 top-4 ${getStatusColor(calculateDaysFromNow(ticket.date))} px-4 py-1.5 rounded-full text-sm font-medium shadow-sm`}>
              {calculateDaysFromNow(ticket.date)}
            </div> */}

            {/* Categories */}
            {ticket.categories && (
              <div className="absolute right-4 top-4 flex gap-2">
                {ticket.categories.map((category:any, index:any) => (
                  <span
                    key={index}
                    className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Rating Star Button */}
            <button
              onClick={handleStarClick}
              className="absolute right-4 bottom-4 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
            >
              <Star
                className={`w-6 h-6 ${
                  ticketRating > 0
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-white'
                }`}
              />
            </button>
          </div>

          {/* Rest of the card content */}
          <div className="p-6 space-y-4">
            {/* ... existing card content ... */}
          </div>
        </CardContent>
      </Card>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
      />
    </motion.div>
  );
};

export default TicketCard;