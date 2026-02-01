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
import { ChevronDownIcon, Divide } from "lucide-react";
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
import { INCOME_CATEGORY_CONSTATNS } from "@/utils/constants";
import { Calendar } from "./ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { set } from "date-fns";

function IncomeModal({
  onAddIncome,
  onUpdateIncome,
  showModal,
  setShowModal,
  incomeObj,
  isEditMode,
  setIsEditMode
}: {
  onAddIncome: (incomeData: ITransactionData) => void;
  onUpdateIncome :(incomeData : ITransactionData) => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  incomeObj: ITransactionData | null;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(incomeObj?.emoji || "💰");
  const [title, setTitle] = useState(incomeObj?.title || "");
  const [category, setCategory] = useState(incomeObj?.category || "");
  const [amount, setAmount] = useState(incomeObj?.amount || "");
  const [date, setDate] = useState<Date | null>(incomeObj?.date || null);
  const [open, setOpen] = useState(false);
  const handleEmojiSelect = (emojiObj: EmojiObject) => {
    setSelectedEmoji(emojiObj.emoji);
    setShowEmojiPicker(false);
  };

  const handleAddIncome = async () => {
    const incomeData: ITransactionData = {
      emoji: selectedEmoji,
      title,
      category,
      amount,
      date,
      _id : incomeObj?._id
    };

    if (!selectedEmoji || !title || !category || !amount || !date) {
      toast.error("Please fill in all fields");
      return;
    }
    if(isEditMode){
      await onUpdateIncome(incomeData);
      setShowModal(false);
    }else{
      await onAddIncome(incomeData);
      setShowModal(false);
    }

    
  };

  const handleReset = () => {
    setSelectedEmoji("💰");
    setTitle("");
    setCategory("");
    setAmount("");
    setDate(null);
  }
  const handleOpen = () => {
    setShowModal(!showModal);
    if(!showModal){
      handleReset();
    }
  };

  useEffect(() => {
    if (incomeObj) {
      setSelectedEmoji(incomeObj.emoji);
      setTitle(incomeObj.title);
      setCategory(incomeObj.category);
      setAmount(incomeObj.amount);
      setDate(incomeObj.date);
    }
  }, [incomeObj]);
  return (
    <Dialog open={showModal} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add income</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription>
            Add income to the list in just a few simple steps{" "}
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
              placeholder="Enter income title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="w-full">
            <span className="font-medium">Category</span>
            <Select
              onValueChange={(value) => setCategory(value)}
              value={category}
            >
              <SelectTrigger className="mt-2 w-full cursor-pointer">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>

                  {INCOME_CATEGORY_CONSTATNS.map((category) => (
                    <SelectItem
                      key={category.value}
                      value={category.value}
                      className="cursor-pointer"
                    >
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
                  selected={date}
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
          <Button className="cursor-pointer" onClick={handleAddIncome}>
            {isEditMode ? "Update Income" : "Add Income"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default IncomeModal;
