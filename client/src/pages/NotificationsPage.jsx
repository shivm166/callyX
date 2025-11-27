import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { useFriendRequestActions } from "../hooks/useFriendRequestActions"; // Import the new hook
import NoNotificationsFound from "../components/NoNotificationsFound";
import { capitialize } from "../lib/utils"; // Correct import for capitalize
import { getLanguageFlag } from "../components/FriendCard"; // Correct import for flags
import { CheckCheckIcon, UserXIcon } from "lucide-react";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  // Use the new hook for actions
  const {
    acceptRequestMutation,
    isAccepting,
    rejectRequestMutation,
    isRejecting,
  } = useFriendRequestActions();

  const {
    data: requests = { incomingReqs: [], acceptedReqs: [] }, // Provide a default structure
    isLoading: loadingRequests,
  } = useQuery({
    queryKey: ["incomingFriendReqs"],
    queryFn: getFriendRequests,
    select: (data) => {
      return {
        incomingReqs: data.incomingReqs || [],
        acceptedReqs: data.acceptedReqs || [],
      };
    },
  });

  const { incomingReqs, acceptedReqs } = requests;
  const showNoNotifications =
    !loadingRequests && incomingReqs.length === 0 && acceptedReqs.length === 0;
  const isPending = isAccepting || isRejecting;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight border-b pb-4">
          Friend Requests & Notifications
        </h2>

        {loadingRequests ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : showNoNotifications ? (
          // Assuming you have a component named NoNotificationsFound
          <NoNotificationsFound />
        ) : (
          <div className="space-y-6">
            {/* Incoming Requests */}
            {incomingReqs.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  Incoming Requests ({incomingReqs.length})
                </h3>
                <div className="space-y-4">
                  {incomingReqs.map((req) => (
                    <div
                      key={req._id}
                      className="card bg-base-200 p-4 flex flex-col md:flex-row items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-12 rounded-full">
                            <img
                              src={req.sender.profilePic}
                              alt={req.sender.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">{req.sender.fullName}</p>
                          <div className="text-xs opacity-70">
                            {getLanguageFlag(req.sender.nativeLanguage)}
                            {capitialize(req.sender.nativeLanguage)} native,
                            learning
                            {getLanguageFlag(req.sender.learningLanguage)}
                            {capitialize(req.sender.learningLanguage)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-3 md:mt-0">
                        {/* ACCEPT BUTTON */}
                        <button
                          onClick={() => acceptRequestMutation(req._id)}
                          disabled={isPending}
                          className="btn btn-sm btn-primary"
                        >
                          <CheckCheckIcon className="size-4" />
                          {isAccepting ? "Accepting..." : "Accept"}
                        </button>

                        {/* REJECT BUTTON */}
                        <button
                          onClick={() => rejectRequestMutation(req._id)}
                          disabled={isPending}
                          className="btn btn-sm btn-error btn-outline"
                        >
                          <UserXIcon className="size-4" />
                          {isRejecting ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Requests */}
            {acceptedReqs.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold mb-4 text-success">
                  Accepted Requests ({acceptedReqs.length})
                </h3>
                <div className="space-y-4">
                  {acceptedReqs.map((req) => (
                    <div
                      key={req._id}
                      className="card bg-base-100 border border-success p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-12 rounded-full">
                            <img
                              src={req.recipient.profilePic}
                              alt={req.recipient.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-success">
                            You are now friends with {req.recipient.fullName}.
                          </p>
                          <p className="text-xs opacity-70">
                            Start a conversation!
                          </p>
                        </div>
                      </div>
                      {/* Assuming the accepted requests return the recipient details */}
                      <Link
                        to={`/chat/${req.recipient._id}`}
                        className="btn btn-sm btn-success"
                      >
                        Go to Chat
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
