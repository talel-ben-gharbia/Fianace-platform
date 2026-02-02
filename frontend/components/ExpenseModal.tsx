"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Modal";
import { Button } from "./ui/Button";
import { ChevronDownIcon } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { EmojiObject, ITransactionData } from "@/utils/types";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { EXPENSE_CATEGORY_CONSTATNS } from "@/utils/constants";
import { Calendar } from "./ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
function ExpenseModal({
  onAddExpense,
  onUpdateExpense,
  showModal,
  setShowModal,
  expenseObj,
  isEditMode,
}: {
  onAddExpense: (incomeData: ITransactionData) => void;
  onUpdateExpense: (incomeData: ITransactionData) => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  expenseObj: ITransactionData | null;
  isEditMode: boolean;
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(expenseObj?.emoji || "💸");
  const [title, setTitle] = useState(expenseObj?.title || "");
  const [category, setCategory] = useState(expenseObj?.category || "");
  const [amount, setAmount] = useState(expenseObj?.amount || "");
  const [date, setDate] = useState<Date | null>(expenseObj?.date || null);
  const [open, setOpen] = useState(false);
  const handleEmojiSelect = (emojiObj: EmojiObject) => {
    setSelectedEmoji(emojiObj.emoji);
    setShowEmojiPicker(false);
  };

  const handleAddExpense = async () => {
    const expenseData: ITransactionData = {
      emoji: selectedEmoji,
      title,
      category,
      amount,
      date,
      transactionType: "Expense",
      _id: expenseObj?._id,
    };

    if (!selectedEmoji || !title || !category || !amount || !date) {
      toast.error("Please fill in all fields");
      return;
    }
    if (isEditMode) {
      await onUpdateExpense(expenseData);
      setShowModal(false);
    } else {
      await onAddExpense(expenseData);
      setShowModal(false);
    }
  };

  const handleReset = () => {
    setSelectedEmoji("💸");
    setTitle("");
    setCategory("");
    setAmount("");
    setDate(null);
  };
  const handleOpen = () => {
    setShowModal(!showModal);
    if (!showModal) {
      handleReset();
    }
  };

  useEffect(() => {
    if (expenseObj) {
      setSelectedEmoji(expenseObj.emoji);
      setTitle(expenseObj.title);
      setCategory(expenseObj.category);
      setAmount(expenseObj.amount);
      setDate(expenseObj.date);
    }
  }, [expenseObj]);
  return (
    <Dialog open={showModal} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add expense to the list in just a few simple steps
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-start justify-center gap-4">
          <div className="relative">
            <span
              className="text-4xl border border-gray-300 py-1 px-2 rounded-md cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {selectedEmoji}
            </span>
            {showEmojiPicker ? (
              <div className="absolute top-[-8] left-18">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            ) : null}
          </div>
          <div className="w-full">
            <span className="font-medium">Title</span>
            <Input
              className="mt-2"
              placeholder="Enter expense title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="w-full">
            <span className="font-medium">Category</span>
            <Select onValueChange={(value) => setCategory(value)} value={category}>
              <SelectTrigger className="mt-2 w-full cursor-pointer">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>

                  {EXPENSE_CATEGORY_CONSTATNS.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="cursor-pointer">
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <span className="font-medium">Amount</span>
            <Input
              className="mt-2"
              placeholder="Enter amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <span className="font-medium">Date</span>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="cursor">
                <Button variant="outline" className="flex justify-between">
                  {date ? new Date(date).toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0">
                <Calendar
                  mode="single"
                  selected={date ?? undefined}
                  onSelect={(date) => {
                    setDate(date ?? null);
                    setOpen(false);
                  }}
                  className="rounded-lg border"
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button className="cursor-pointer" onClick={handleAddExpense}>
            {isEditMode ? "Update Expense" : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseModal;
