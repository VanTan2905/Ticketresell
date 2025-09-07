import React, { useEffect, useState } from "react";
import { fetchImage } from "@/models/FetchImage";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface Category {
  categoryId: string;
  name: string;
}

interface Ticket {
  ticketId: string;
  name: string;
  cost: number;
  location: string;
  startDate: string;
  imageUrl: string;
  description: string;
  categories: Category[];
}

interface RelatedTicketsProps {
  categoriesId: string[]; // Pass categoriesId as props
  ticketID: string;
}

const RelatedTicket: React.FC<RelatedTicketsProps> = ({
  categoriesId,
  ticketID,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const DEFAULT_IMAGE =
    "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  // Fetch related tickets based on categoriesId
  useEffect(() => {
    const fetchRelatedTickets = async () => {
      try {
        const [notByCateResponse, byCateResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Ticket/getnotbyCate/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoriesId),
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Ticket/getbyCate/${ticketID}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoriesId),
          }),
        ]);

        const notByCateTickets = await notByCateResponse.json();
        const byCateTickets = await byCateResponse.json();
        console.log(byCateTickets);

        const result = [];

        // Add 2 tickets from getbyCate first
        const byCateSelection = byCateTickets.data.slice(0, 2);
        result.push(...byCateSelection);

        // Add 2 tickets from getnotbyCate
        const notByCateSelection = notByCateTickets.data.slice(0, 2);
        result.push(...notByCateSelection);

        // If result has less than 4 items, fill from the remaining tickets from either API
        if (result.length < 4) {
          const remainingTickets =
            notByCateTickets.length > byCateTickets.length
              ? notByCateTickets.slice(2)
              : byCateTickets.slice(2);

          result.push(...remainingTickets.slice(0, 4 - result.length));
        }

        let updatedTickets = await Promise.all(
          result.map(async (ticket: any) => {
            let imageUrl = DEFAULT_IMAGE; // Default image

            // Check if the ticket has an image and fetch it
            if (ticket.image) {
              const { imageUrl: fetchedImageUrl, error } = await fetchImage(
                ticket.image
              );
              if (fetchedImageUrl) {
                imageUrl = fetchedImageUrl;
              } else {
                console.error(
                  `Error fetching image for ticket ${ticket.ticketId}: ${error}`
                );
              }
            }

            // Return updated ticket object
            return {
              ...ticket,
              imageUrl, // Assign the fetched or default image URL
            };
          })
        );
        setTickets(updatedTickets);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching related tickets:", error);
        setIsLoading(false);
      }
    };

    if (categoriesId.length > 0) {
      fetchRelatedTickets();
    }
  }, [categoriesId]);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="ticket--related">
      <div className="flex justify-between items-center px-4">
        <h3 className="text-2xl font-bold mx-auto">Có thể bạn sẽ thích</h3>
        <Link
          href="/search"
          className="group flex items-center space-x-2 text-sm md:text-base text-green-600 hover:text-green-700 transition-colors duration-200"
        >
          <span>Xem tất cả sự kiện</span>
          <FontAwesomeIcon
            icon={faArrowRight}
            className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>

      <div className="mx-auto px-10 py-8 no-underline grid grid-cols-2 lg:grid-cols-4 gap-[1vw]">
        {tickets.map((ticket) => (
          <Link key={ticket.ticketId} className="no-underline" href={`/ticket/${ticket.ticketId}`}>
            <div className="movie-card-wrapper cursor-pointer no-underline visited:no-underline transform transition-transform duration-300 hover:scale-105">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden movie-card">
                <div className="relative">
                  <img
                    src={ticket.imageUrl}
                    alt={ticket.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-2xl">
                    {formatVND(ticket.cost)}
                  </div>
                </div>
                <div className="p-4 space-y-2 flex-grow">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">
                    {truncateString(ticket.name, 25)} {/* Truncate name */}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {truncateString(ticket.location, 35)} {/* Truncate location */}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticket.startDate).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </p>
                  <ul className="flex flex-wrap gap-2 tag--list overflow-hidden">
                    {ticket.categories.length > 0 ? (
                      ticket.categories.slice(0, 1).map((category) => (
                        <li
                          key={category.categoryId}
                          className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                        >
                          {category.name}
                        </li>
                      ))
                    ) : (
                      <li className="bg-gray-300 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Không có danh mục
                      </li>
                    )}
                    {ticket.categories.length > 1 && (
                      <li className="bg-gray-300 text-white px-3 rounded-full text-sm font-semibold hidden sm:block">
                        ...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default RelatedTicket;
