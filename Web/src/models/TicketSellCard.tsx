// models/TicketCardModel.ts
import { fetchImage } from "./FetchImage";

export interface Categories{
  categoryId:string;
  name:string;
  description:string;
}

export interface TicketCard {
  name: string;
  price: number;
  id: string ;
  date: string;
  imageUrl: string;
  categories:Categories[];
  location: string;
  quantity:number;
}

const DEFAULT_IMAGE =
  "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";

  const splitId =  (id:string) => {
    if (id) {
      return id.split("_")[0];
    } else {
      console.error("id.fullTicketId is undefined or null");
      return null;
    }
  };
  
  export const convertToTicketCards = async (
    response: any[]
  ): Promise<TicketCard[]> => {
    const ticketCards = await Promise.all(
      response.map(async (item) => {
        let imageUrl = DEFAULT_IMAGE;
  
        if (item.image) {
          const { imageUrl: fetchedImageUrl, error } = await fetchImage(
            item.image
          );
  
          if (fetchedImageUrl) {
            imageUrl = fetchedImageUrl;
          } else {
            console.error(
              `Error fetching image for ticket ${item.ticketId}: ${error}`
            );
          }
        }
  
        const baseId = splitId(item.ticketId) ?? ""; 
        const count = await fetchRemainingByID(baseId); 
        
        return {
          name: item.name,
          price: item.cost.toString(),
          id: baseId, 
          date: formatDate(item.startDate),
          categories: item.categories.map((category: any) => ({
            categoryId: category.categoryId,
            name: category.name,
            description: category.description,
          })),
          location: item.location,
          imageUrl,
          quantity: count, 
        };
      })
    );
  
    return ticketCards;
  };
  
  const formatDate = (dateString: any) => {
    const date = new Date(dateString + "Z");
    // Extract the day, month, and year manually
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    // Extract hours and minutes
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };
  
import Cookies from "js-cookie";

const fetchRemainingByID = async (id: string | null) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Ticket/count/${id}`,
      {
        method: "GET",
      }
    );
    const result=  await response.json();
    return result.data
  } catch (error) {
    console.error("Error fetching ticket result:", error);
  }
};


export const fetchTicketItems = async (): Promise<TicketCard[]> => {
  const id = Cookies.get("id");
  if (!id) {
    throw new Error("Seller ID not found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ticket/readbySellerId/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  const result = await response.json();
  return convertToTicketCards(result.data);
};
