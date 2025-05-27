"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUIConfig,
} from "@liveblocks/react-ui";
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
  useMarkInboxNotificationAsRead,
} from "@liveblocks/react/suspense";
import { Bell, BellRing, User, X } from "lucide-react";
import { ReactNode } from "react";

const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();
  const markAsRead = useMarkInboxNotificationAsRead();

  const unreadNotifications = inboxNotifications.filter(
    (notification) => !notification.readAt
  );

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  return (
    <Popover>
      <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg hover:bg-gray-800/50 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500/50">
        {count > 0 ? (
          <BellRing className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform duration-200" />
        ) : (
          <Bell className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
        )}
        {count > 0 && (
          <div className="absolute -right-1 -top-1 z-20 min-w-5 h-5 px-1 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
            <span className="text-xs font-medium text-white">
              {count > 99 ? "99+" : count}
            </span>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="glass-card w-80 p-0 shadow-2xl border border-gray-700/50 z-[9999]"
        sideOffset={8}
      >
        <div className="p-4 border-b border-gray-700/50">
          <h3 className="font-semibold text-white">Notifications</h3>
          {count > 0 && <p className="text-sm text-gray-400">{count} unread</p>}
        </div>

        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          <LiveblocksUIConfig
            overrides={{
              INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
                <>{user} mentioned you.</>
              ),
            }}
          >
            <InboxNotificationList>
              {unreadNotifications.length <= 0 && (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-gray-400 font-medium">
                    No new notifications
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    You're all caught up!
                  </p>
                </div>
              )}

              {unreadNotifications.length > 0 &&
                unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="relative group hover:bg-red-500/10 transition-colors duration-200 border-b border-gray-700/50 last:border-0 p-3 rounded-lg mx-2 my-1 hover:text-white"
                  >
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-500/20 rounded-full z-10"
                      title="Mark as read"
                    >
                      <X className="w-3 h-3 text-gray-400 hover:text-white" />
                    </button>
                    <InboxNotification
                      inboxNotification={notification}
                      className="w-full hover:text-white"
                      href={`/documents/${notification.roomId}`}
                      showActions={false}
                      kinds={{
                        thread: (props) => (
                          <InboxNotification.Thread
                            {...props}
                            showActions={false}
                            showRoomName={false}
                            className="hover:text-white"
                          />
                        ),
                        textMention: (props) => (
                          <InboxNotification.TextMention
                            {...props}
                            showRoomName={false}
                            className="hover:text-white"
                          />
                        ),
                        $documentAccess: (props) => (
                          <InboxNotification.Custom
                            {...props}
                            title={
                              props.inboxNotification.activities[0].data.title
                            }
                            aside={
                              <InboxNotification.Icon className="bg-transparent">
                                <div className="w-9 h-9 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-red-400" />
                                </div>
                              </InboxNotification.Icon>
                            }
                            className="hover:text-white"
                          >
                            <div className="hover:text-white">
                              {props.children}
                            </div>
                          </InboxNotification.Custom>
                        ),
                      }}
                    />
                  </div>
                ))}
            </InboxNotificationList>
          </LiveblocksUIConfig>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
