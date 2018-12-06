const TYPE_BANNER = 'TYPE_BANNER';
const TYPE_TOAST = 'TYPE_TOAST';

/**
 * - `icon`     Material icon text.
 * - `buttons`  A list of React Elements, typically `<span>...</span>`.
 * - `level`    0 - ignorable, 1 - normal, 2 - warning, 3 - critical
 * - `timeout`  (in ms) If you want it to show until user closes it, do not pass 
 * this (leave it undefined).
 * 
 * - `onClose`  Sometimes, user will not click any given button, but just close the
 * banner. You can use this callback to know this is the case.
 * 
 * Note that when passing `buttons`, it should be a span wrapping only
 * text, and without any style classes (notification module will take 
 * care of that), like following:
 * 
 * ```
 * <span (onClick)={myClickHandler}>More Info</span>
 * ```
 * 
 * Also note that you SHOULD provide no more than two buttons.
 */
class NotificationEntry {
  static entryCounter = 0;

  constructor({
    icon = 'info_outline', title = 'Notification', message = '', buttons = [], 
    type = TYPE_BANNER, level = 0, timeout, onClose } = {})
  {
    this.id = `${NotificationEntry.entryCounter++}`;
    this.icon = icon;
    this.title = title;
    this.message = message;
    this.buttons = buttons;
    this.type = type;
    this.level = level;
    this.timeout = timeout;
    this.onClose = onClose;
  }
}

export { NotificationEntry, TYPE_BANNER, TYPE_TOAST };

export default NotificationEntry;
