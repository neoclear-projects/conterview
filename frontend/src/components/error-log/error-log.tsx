import { notification } from "antd";

export default function errorLog(err: string) {
  notification['error']({
    message: 'Error Message',
    description: err,
  });
};
