"use client";
import "@/Css/Trend.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import TicketList, {
  fetchTopTicketData,
  RankItemCardProps,
} from "@/models/RankItemCard";
import { log } from "console";
import { Bank } from "vnpay";
import { BannerItemCard, fetchBannerItems, fetchCategories } from "@/models/CategoryCard";
import CategoryCarousel from "./TicketByCategory";
import React from "react";
interface Category {
  categoryId: string;
  name: string;
  description: string;
}
const Trend = () => {
  const [buttonLeftActive, setButtonLeftActive] = useState(0);
  const [buttonRightActive, setButtonRightActive] = useState(6);
  const [TopticketList, setTopTicketList] = useState<RankItemCardProps[]>([]);
  const [ticketTimeRange, setTicketTimeRange] = useState("60.00:00:00");
  const [error, setError] = useState("");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bannerItems, setBannerItems] = useState<BannerItemCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const ticketData = await fetchTopTicketData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ticket/gettop/6`
      );
      setTopTicketList(ticketData);
    };

    fetchData().catch((error) => {
      console.error("Failed to fetch top ticket data:", error);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const banner = await fetchBannerItems();
      setBannerItems(banner);
      const cate = await fetchCategories();
      setCategories(cate);
    };

    fetchData();
  }, []);


  const splitTicketList = (list: RankItemCardProps[]) => {
    let newList = [...list];
    if (newList.length % 2 !== 0) {
      newList.pop();
    }

    const midpoint = newList.length / 2;

    return [newList.slice(0, midpoint), newList.slice(midpoint)];
  };
  const [firstHalf, secondHalf] = splitTicketList(TopticketList);

  const fetchTrendingTickets = async () => {
    try {
      const ticketData = await fetchTopTicketData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ticket/gettop/6`
      );
      setTopTicketList(ticketData);
    } catch (error) {
      console.error("Failed to fetch top ticket data:", error);
    }
  };
  useEffect(() => {
    if (buttonLeftActive === 1) {
      fetchStartingSoonTickets();
    }
  }, [ticketTimeRange, buttonLeftActive]);
  const fetchStartingSoonTickets = async () => {
    try {
      const timeRange = ticketTimeRange; // 60 day
      const requestBody = {
        ticketAmount: 6, // Same amount as trending
        timeRange: timeRange,
      };

      const ticketData = await fetchTopTicketData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ticket/getticketsbytimerange`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Only set the ticket list if we have valid data
      if (Array.isArray(ticketData) && ticketData.length > 0) {
        setTopTicketList(ticketData);
        setError("");
      }
    } catch (error) {
      setError("");
      setTimeout(() => {
        setError("No tickets found for the selected time range.");
      }, 10);
    }
  };

  const handleLeftButtonClick = (buttonIndex: number) => {
    setButtonLeftActive(buttonIndex);
    if (buttonIndex === 0) {
      fetchTrendingTickets();
    } else {
      fetchStartingSoonTickets();
    }
  };
  const limitedCategories = categories.slice(0, 6);
  const handleRightButtonClick = (index: any) => {
    setButtonRightActive(index);

    if (index == 2) {
      setTicketTimeRange("00.01:00:00");
    } else if (index == 3) {
      setTicketTimeRange("00.12:00:00");
    } else if (index == 4) {
      setTicketTimeRange("00.24:00:00");
    } else if (index == 5) {
      setTicketTimeRange("7.01:00:00");
    } else if (index == 6) {
      setTicketTimeRange("30.01:00:00");
    }
  };
  return (
    <div>
      <div className="top-bar">
        <nav className="navbar" aria-label="Category Navigation">
          <div className="navbar-left" style={{ display: "flex", gap: "10px" }}>
            <div>
              <button
                className={
                  buttonLeftActive === 0 ? "trend isactivate" : "trend"
                }
                onClick={() => handleLeftButtonClick(0)}
              >
                Xu hướng
              </button>
              <button
                className={buttonLeftActive === 1 ? "soon isactivate" : "soon"}
                onClick={() => handleLeftButtonClick(1)}
              >
                Sắp bắt đầu
              </button>
            </div>
          </div>
          <div>
            {buttonLeftActive === 1 && (
              <>
                <div
                  className="navbar-right"
                  style={{ display: "flex", gap: "10px" }}
                >
                  <button
                    className={buttonRightActive === 2 ? "isactivate" : ""}
                    onClick={() => handleRightButtonClick(2)}
                  >
                    1h
                  </button>
                  <button
                    className={buttonRightActive === 3 ? "isactivate" : ""}
                    onClick={() => handleRightButtonClick(3)}
                  >
                    12h
                  </button>
                  <button
                    className={buttonRightActive === 4 ? "isactivate" : ""}
                    onClick={() => handleRightButtonClick(4)}
                  >
                    1d
                  </button>
                  <button
                    className={buttonRightActive === 5 ? "isactivate" : ""}
                    onClick={() => handleRightButtonClick(5)}
                  >
                    1w
                  </button>
                  <button
                    className={buttonRightActive === 6 ? "isactivate" : ""}
                    onClick={() => handleRightButtonClick(6)}
                  >
                    1m
                  </button>
                </div>
                {error && (
                  <div
                    style={{
                      position: "absolute",
                      textAlign: "center",
                      color: "white",
                      marginTop: "-6rem",
                      fontSize: "0.7rem",
                      alignItems: "center",
                      marginLeft: "6rem",
                      height: "1.2rem",
                      padding: "0.2rem 0.4rem 1.4rem 0.4rem",
                      backgroundColor: "rgb(239,135,135, 0.8)",
                      borderRadius: "6px",
                      animation:
                        "0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s 1 normal both running popIn",
                    }}
                  >
                    <style>
                      {`
                      @keyframes popIn {
                        from {
                          opacity: 0;
                          transform: scale(0.95);
                        }
                        to {
                          opacity: 1;
                          transform: scale(1);
                        }
                      }
                    `}
                    </style>
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
      <div className="ranking">
        <div className="left-rank">
          <div className="rank-bar-container">
            <div className="rank-bar">
              <div className="left-info">
                <span className="rank">Hạng</span>
                <span className="ticket">Vé</span>
              </div>
              <div className="right-info">
                <span className="price">Giá</span>
              </div>
            </div>
            <div className="rank-item">
              <TicketList topTicketList={firstHalf} />
            </div>
          </div>
        </div>
        <div className="right-rank">
          <div className="rank-bar-container">
            <div className="rank-bar">
              <div className="left-info">
                <span className="rank">Hạng</span>
                <span className="ticket">Vé</span>
              </div>
              <div className="right-info">
                <span className="price">Giá</span>
              </div>
            </div>
            <div className="rank-item">
              <TicketList topTicketList={secondHalf} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-16 pt-5">
      {limitedCategories.length > 0 ? (
        limitedCategories.map((category) => (
          <CategoryCarousel key={category.categoryId} category={category} />
        ))
      ) : (
        <p>Đang tải danh mục...</p>
      )}
    </div>
    </div>
  );
};

export default Trend;
