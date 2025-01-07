import { createContext, useContext, ReactNode, useState } from "react";
import { fetchComments as fetchCommentsApi } from "../api/comment";
import { IComment } from "../interfaces/interface";

const CommentContext = createContext<{
  comments: IComment[] | null;
  loading: boolean;
  fetchComments: () => void;
}>({
  comments: null,
  loading: true,
  fetchComments: () => {},
});

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [comments, setComments] = useState<IComment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetchCommentsApi();
      setComments(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CommentContext.Provider value={{ comments, fetchComments, loading }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComment = () => useContext(CommentContext);
