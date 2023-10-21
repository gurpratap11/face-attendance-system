import { Button, FileInput, Modal, createStyles } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";
import {
  memo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
  useState,
  useEffect,
} from "react";
import { notifications } from "@mantine/notifications";
import { useAddStudentMutation } from "../../../hooks/students/mutation/addStudent.mutation";
import { initialValue } from "../../../form/initial-value";
import { validations } from "../../../form/validation";
import InputField from "../../../component/form/input-field/InputField";
import PasswordField from "../../../component/form/password-field/Index";
import { useUpdateStudent } from "../../../hooks/students/mutation/updateStudent.mutation";
import { TStudentValues } from "../../../form/initial-value/addStudent.values";
import { Box, Text } from "@mantine/core";
export interface IStudentModalRef {
  toggleModal: () => void;
  updateData: (student: TStudentData) => void;
}
interface IStudentModalProps {
  reload: () => void;
}

const StudentModal = (
  props: IStudentModalProps,
  ref: ForwardedRef<IStudentModalRef>
) => {
  const [data, setData] = useState<TStudentData>();
  const { reload } = props;
  const [opened, toggle] = useToggle();
  const { classes } = useStyles();
  const { isLoading: addLoading, mutateAsync: addStudent } =
    useAddStudentMutation();
  const { isLoading: updateLoading, mutateAsync: updateStudent } =
    useUpdateStudent();
  const { getInputProps, onSubmit, reset, setValues } = useForm({
    initialValues: initialValue.AddStudentValues,
    validate: yupResolver(validations.addStudent),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });
  useEffect(() => {
    if (data) {
      setValues(data);
    } else {
      setValues(initialValue.AddStudentValues);
    }
  }, [setValues, data]);

  const handleFormSubmit = useCallback(
    async (values: TStudentValues) => {
      const res = data ? await updateStudent(values) : await addStudent(values);
      if (res.status === "success") {
        reload();
        toggle();
        reset();
        notifications.show({
          color: "green",
          message: res.message,
        });
      } else {
        notifications.show({
          color: "red",
          message: res.data.message,
        });
      }
    },
    [addStudent, toggle, reload, reset, updateStudent, data]
  );
  const handelCloseModal = useCallback(() => {
    toggle();
    setData(undefined);
  }, [toggle]);

  useImperativeHandle(
    ref,
    () => {
      return {
        toggleModal: handelCloseModal,
        updateData: (d) => setData(d),
      };
    },
    [handelCloseModal]
  );

  return (
    <Modal
      styles={{
        title: { fontSize: "1.3rem", fontWeight: 500 },
        close: {
          color: "#ff008a",
          "&:hover": {
            backgroundColor: "#ff008a",
            color: "white",
            transition: " all 0.2s ease-in-out 0s;",
          },
        },
      }}
      opened={opened}
      onClose={handelCloseModal}
      title={data ? "Edit Student" : "Add Student"}
      centered
    >
      <form onSubmit={onSubmit(handleFormSubmit)}>
        <InputField label="Name" name="name" getInputProps={getInputProps} />
        <InputField label="Email" name="email" getInputProps={getInputProps} />
        <InputField
          label="Mobile no."
          name="mobile"
          getInputProps={getInputProps}
        />
        {!data && (
          <PasswordField
            label="Password"
            name="password"
            getInputProps={getInputProps}
          />
        )}
        <Box style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <Text mb={15} style={{ marginBottom: "0.4rem", marginTop: "0.4rem" }}>
            Upload Photo
          </Text>
          <FileInput placeholder="Select File" />
        </Box>
        <Button
          disabled={addLoading || updateLoading}
          loading={addLoading || updateLoading}
          type="submit"
          fullWidth
          mt="xl"
          className={classes.btn}
        >
          {data ? "Update Student" : "Add Student"}
        </Button>
      </form>
    </Modal>
  );
};
const useStyles = createStyles((theme) => ({
  btn: {
    background: "#ff008a",
    height: "45px",
    "&:hover": {
      backgroundColor: "#ff008a",
      color: "white",
    },
  },
}));

export default memo(forwardRef(StudentModal));
