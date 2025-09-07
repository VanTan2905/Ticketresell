import { fetchImage } from "./FetchImage";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

export interface Category {
  categoryId: string;
  name: string;
  description: string;
}

export interface Ticket {
  ticketId: string;
  sellerId: string;
  name: string;
  cost: number;
  location: string;
  startDate: string;
  createDate: string;
  modifyDate: string;
  status: number;
  seller: null | any;
  image: string;
  categories: Category[];
  imageUrl?: string;
  description: string;
}

const DEFAULT_IMAGE =
  "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";

// Helper function to convert API response to Ticket format
const convertToTickets = async (response: any[]): Promise<Ticket[]> => {
  const tickets = await Promise.all(
    response.map(async (item) => {
      let image = DEFAULT_IMAGE;

      if (item.image) {
        const { imageUrl: fetchedImageUrl, error } = await fetchImage(
          item.image
        );

        if (fetchedImageUrl) {
          image = fetchedImageUrl;
        } else {
          console.error(
            `Error fetching image for ticket ${item.ticketId}: ${error}`
          );
        }
      }

      console.log(image);

      return {
        ...item,
        imageUrl: image,
      };
    })
  );
  return tickets;
};

export const fetchTickets = async (): Promise<Ticket[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/Ticket/read`,{
      credentials: "include"
    }); 
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Ticket fetch: ", data.data);
    const tickets = await convertToTickets(data.data);
    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

export const getCategoryNames = (ticket: Ticket): string => {
  const { categories } = ticket;

  if (categories.length > 3) {
    return (
      categories
        .slice(0, 3)
        .map((category) => category.name)
        .join(", ") + ", . . ."
    );
  }

  return categories.map((category) => category.name).join(", ");
};
export const fetchTicketsBySeller = async (): Promise<Ticket[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/Ticket/readbySellerId`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Ticket fetch: ", result.data);
    const tickets = await convertToTickets(result.data);
    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};
export const fetchRemainingByID = async (id: string | null) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Ticket/count/${id}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    const count = parseInt(result.data, 10);
    return count;
  } catch (error) {
    console.error("Error fetching ticket result:", error);
    return 0;
  }
};
