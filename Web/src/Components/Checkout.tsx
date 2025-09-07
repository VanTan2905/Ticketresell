"use client"
import React, { useState, useEffect } from "react";
import { CreditCard, Calendar, CheckCircle, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchTickets, Ticket } from "@/models/TicketFetch";
import { motion } from "framer-motion";

interface CheckoutItem {
  orderDetailId: string;
  ticketId: string;
  price: number;
  quantity: number;
  ticket: {
    name: string;
    imageUrl: string;
    startDate: string;
  };
}

const Checkout: React.FC = () => {
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [suggestedTickets, setSuggestedTickets] = useState<Ticket[]>([]);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedItems = localStorage.getItem("selectedTickets");
        const storedPaymentMethod = localStorage.getItem("paymentMethod");

        const tickets = await fetchTickets();

        if (storedItems) {
          try {
            const parsedItems = JSON.parse(storedItems);
            setItems(parsedItems);
          } catch (error) {
            console.error("Error parsing selected tickets:", error);
            localStorage.removeItem("selectedTickets");
          }
        }
        if (storedPaymentMethod) {
          setPaymentMethod(storedPaymentMethod);
        }

        setSuggestedTickets(tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchData();
  }, []);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const totalPrice = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { items, paymentMethod, totalPrice });
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  const handleAddSuggestedTicket = (ticket: Ticket) => {
    const newItem: CheckoutItem = {
      orderDetailId: `new-${Date.now()}`,
      ticketId: ticket.ticketId,
      price: ticket.cost,
      quantity: 1,
      ticket: {
        name: ticket.name,
        imageUrl: ticket.imageUrl || "",
        startDate: ticket.startDate,
      },
    };
    setItems([...items, newItem]);
  };

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating]);

  const nextGroup = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentGroup((prevGroup) => (prevGroup + 1) % Math.ceil(suggestedTickets.length / 5));
    }
  };

  const prevGroup = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentGroup((prevGroup) => (prevGroup - 1 + Math.ceil(suggestedTickets.length / 5)) % Math.ceil(suggestedTickets.length / 5));
    }
  };

  const currentTickets = suggestedTickets.slice(currentGroup * 5, (currentGroup + 1) * 5);

  return (
    <div className="mt-24 min-h-screen w-full bg-gray-100 py-16 px-6 sm:px-8 lg:px-12">
      <div className="w-full mx-auto">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-16 text-center">
          Complete Your Purchase
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                <h2 className="text-3xl leading-8 font-semibold text-gray-900">Order Summary</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.orderDetailId} className="px-8 py-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img src={item.ticket.imageUrl} alt={item.ticket.name} className="h-32 w-32 rounded-xl object-cover mr-8" />
                        <div>
                          <h3 className="text-2xl font-medium text-gray-900">{item.ticket.name}</h3>
                          <p className="mt-2 text-xl text-gray-500 flex items-center">
                            <Calendar className="inline-block mr-2 h-6 w-6" />
                            {new Date(item.ticket.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-medium text-gray-900">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          
      
          </div>

          {/* Order Total and Checkout Button */}
          <div className="space-y-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-8 py-8">
                <dl className="space-y-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-xl text-gray-600">Subtotal</dt>
                    <dd className="text-xl font-medium text-gray-900">€{subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-xl text-gray-600">Tax (5%)</dt>
                    <dd className="text-xl font-medium text-gray-900">€{tax.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center space-x-4">
                      <CreditCard className="h-12 w-12 text-gray-400" />
                      <span className="text-2xl text-gray-700">{paymentMethod}</span>
                    </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-2xl font-medium text-gray-900">Order total</dt>
                    <dd className="text-2xl font-medium text-gray-900">€{totalPrice.toFixed(2)}</dd>
                  </div>
                </dl>
                <div className="mt-10">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 border border-transparent rounded-xl shadow-lg py-4 px-6 text-2xl font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300"
                  >
                    Confirm Order
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-lg text-gray-500 flex items-center justify-center">
                    <Lock className="h-6 w-6 mr-2" />
                    Secure checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Tickets */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">RECOMMENDED TICKETS</h2>
          <div className="relative">
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {currentTickets.map((ticket) => (
                  <motion.div
                    key={ticket.ticketId}
                    className="bg-white rounded-xl shadow-xl overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img src={ticket.imageUrl} alt={ticket.name} className="h-48 w-full object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{ticket.name}</h3>
                      <p className="text-lg text-gray-500 mb-4">{new Date(ticket.startDate).toLocaleDateString()}</p>
                      <p className="text-xl font-semibold text-gray-900">€{ticket.cost}</p>
                      <button
                        onClick={() => handleAddSuggestedTicket(ticket)}
                        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl shadow-lg text-lg font-medium transition duration-300 hover:bg-indigo-700"
                      >
                        Add Ticket
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <button
              onClick={prevGroup}
              aria-label="Previous Group"
              className={`absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:bg-gray-100 transition duration-300 ${isAnimating ? "opacity-50 pointer-events-none" : ""
                }`}
            >
              <ChevronLeft className="h-8 w-8 text-gray-600" />
            </button>
            <button
              onClick={nextGroup}
              aria-label="Next Group"
              className={`absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:bg-gray-100 transition duration-300 ${isAnimating ? "opacity-50 pointer-events-none" : ""
                }`}
            >
              <ChevronRight className="h-8 w-8 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {showSuccessAlert && (
          <motion.div
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg text-lg font-semibold flex items-center space-x-4"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="h-8 w-8" />
            <span>Order confirmed! Redirecting...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Checkout;