import natural from 'natural';
import { output } from 'pdfkit';

// Sample training data
const trainingData = [
  { input: 'Hello', output: 'Hi there!' },
  { input: 'Hii', output: 'Hi there!' },
  { input: 'Hellow', output: 'Hi there!' },
  {
    input: "How can I book a hotel room?",
    output: "You can book a hotel room by visiting our website and selecting your desired dates, location, and room type. Follow the on-screen instructions to complete your booking."
  },
  {
    input: "What are the available room types?",
    output: "We offer a variety of room types, including standard rooms, suites, and deluxe rooms. You can find more details on our website or by contacting our customer support."
  },
  {
    input: "What is the check-in/check-out time?",
    output: "Check-in time is at 3:00 PM, and check-out time is at 12:00 PM. If you need early check-in or late check-out, please let us know in advance, and we'll do our best to accommodate your request."
  },
  {
    input: "Do you offer free Wi-Fi?",
    output: "Yes, we provide complimentary Wi-Fi access for all our guests throughout the hotel."
  },
  {
    input: "Is breakfast included in the room rate?",
    output: "We offer a variety of room packages, some of which include breakfast. You can check the details of each package when making your reservation."
  },
  {
    input: "Can I cancel or modify my reservation?",
    output: "Yes, you can cancel or modify your reservation by logging into your account on our website or by contacting our reservations team. Please check our cancellation policy for more information."
  },
  {
    input: "What is your pet policy?",
    output: "We have a pet-friendly policy. Please inform us in advance if you plan to bring your pet, and we'll provide you with the necessary information and guidelines for a comfortable stay with your furry friend."
  },
  {
    input: "Do you offer airport shuttle service?",
    output: "Yes, we offer airport shuttle service. You can request this service when making your reservation or inquire at the front desk upon arrival."
  },
  {
    input: "What amenities are available in the hotel?",
    output: "Our hotel offers a range of amenities, including a swimming pool, fitness center, on-site restaurant, room service, and conference facilities. You can find more details on our website."
  },
  {
    input: "How can I contact the hotel for further assistance?",
    output: "You can reach our hotel's customer support team by phone at [phone number] or by email at [email address]. We're available 24/7 to assist you with any questions or concerns."
  },
  {
    input: "How far is the hotel from the airport?",
    output: "Our hotel is located approximately 15 miles from the nearest airport. We can arrange airport transportation for your convenience."
  },
  {
    input: "What payment methods do you accept?",
    output: "We accept major credit cards, including Visa, MasterCard, and American Express. You can also pay with cash or use mobile payment apps."
  },
  {
    input: "Is there a minimum age requirement for booking a room?",
    output: "Yes, the minimum age requirement for booking a room is 18 years old. A valid ID is required upon check-in."
  },
  {
    input: "Can I request a specific room with a view?",
    output: "Yes, you can request a room with a specific view when making your reservation. We will do our best to accommodate your request based on availability."
  },
  {
    input: "What is your cancellation policy?",
    output: "Our cancellation policy varies depending on the type of room and rate you choose. You can find detailed information on our website or during the booking process."
  },
  {
    input: "Are there any special discounts for long-term stays?",
    output: "Yes, we offer special rates for guests booking an extended stay. Please contact our reservations team for more information on long-term stay discounts."
  },
  {
    input: "Do you have a loyalty program?",
    output: "Yes, we have a loyalty program that offers exclusive benefits and rewards to our frequent guests. You can sign up for our loyalty program on our website."
  },
  {
    input: "Are there any nearby attractions or restaurants?",
    output: "Our hotel is conveniently located near several popular attractions and restaurants. Our front desk staff can provide you with recommendations and directions."
  },
  {
    input: "Can I request additional amenities in my room?",
    output: "Yes, you can request additional amenities such as extra towels, pillows, or a mini-fridge for your room. Please inform us in advance or ask at the front desk."
  },
  {
    input: "What is your policy on smoking in the rooms?",
    output: "Our hotel is entirely non-smoking. Smoking is prohibited in all indoor areas, including guest rooms. We have designated outdoor smoking areas available."
  },
  {
    input: "Is room service available?",
    output: "Yes, we offer room service. You can order from our room service menu during specific hours. Details can be found in your room."
  },
  {
    input: "What is the cost of parking at the hotel?",
    output: "Parking at our hotel is free for registered guests. We provide secure and convenient parking facilities on the premises."
  },
  {
    input: "Can I reserve a room for an event or conference?",
    output: "Certainly! We have event and conference facilities available for reservation. Please contact our events team for more information and availability."
  },
  {
    input: "Are there any special offers or promotions currently available?",
    output: "Yes, we have ongoing special offers and promotions. You can view our current deals on our website or contact our reservations team for details."
  },
  {
    input: "What is the policy on extra beds for children?",
    output: "We provide extra beds or cribs for children at no additional cost. Please request them when making your reservation so we can prepare accordingly."
  },
  {
    input: "Can I arrange a surprise for my partner during our stay?",
    output: "Of course! We can assist you in arranging special surprises for your partner, such as flowers, chocolates, or room decorations. Contact our concierge for assistance."
  },
  {
    input: "How do I apply for a group booking discount?",
    output: "For group bookings, please contact our group reservations team. They can provide you with information on available discounts and group rates."
  },
  {
    input: "Do you have accessible rooms for guests with disabilities?",
    output: "Yes, we have accessible rooms designed to accommodate guests with disabilities. Please request an accessible room when making your reservation."
  },
  {
    input: "Is there a dress code for your on-site restaurant?",
    output: "Our on-site restaurant may have a dress code for dinner service. We recommend smart-casual attire. Details can be found on our website."
  },
  {
    input: "What is the process for extending my stay?",
    output: "You can request an extension of your stay by contacting our front desk or reservations team. We will check room availability and assist you accordingly."
  },
  {
    input: "Are there any hidden fees or charges I should be aware of?",
    output: "We are transparent about our fees and charges. The total cost of your stay, including taxes and fees, will be provided to you during the booking process."
  },
  {
    input: "Can I request a wake-up call?",
    output: "Yes, you can request a wake-up call at the front desk. We'll make sure you don't miss any important plans or appointments."
  },
  {
    input: "Do you provide laundry services for guests?",
    output: "Yes, we offer laundry services for our guests. You can request laundry or dry-cleaning services at the front desk."
  },
  {
    input: "What is your policy on late check-out?",
    output: "Late check-out is available upon request, subject to availability. Additional fees may apply. Please inquire at the front desk."
  },
  {
    input: "Do you have a business center with printing facilities?",
    output: "Yes, we have a business center with printing and photocopying facilities. It's available for guests who need to attend to work-related tasks."
  },
  {
    input: "Can I store my luggage after check-out?",
    output: "We offer luggage storage facilities for guests who need to store their luggage after check-out. You can leave your bags with us while you explore the area."
  },
  {
    input: "What is the nearest public transportation option?",
    output: "The nearest public transportation option is [describe the transportation, e.g., subway station, bus stop], which is located [mention distance] from our hotel."
  },
  {
    input: "Can you recommend nearby sightseeing attractions?",
    output: "Certainly! There are several popular attractions near our hotel, including [list a few attractions]. We can provide you with directions and recommendations."
  },
  {
    input: "What safety measures do you have in place for guests?",
    output: "We take guest safety seriously. Our hotel has security measures in place, including 24/7 surveillance, secure access, and trained staff to assist in case of emergencies."
  },
  {
    input: "Do you offer special packages for honeymooners?",
    output: "Yes, we have special honeymoon packages that include romantic amenities and experiences. Contact our reservations team for details and availability."
  },
  {
    input: "Can I make special dietary requests for meals?",
    output: "We can accommodate special dietary requests. Please inform us of your dietary preferences or restrictions when making your reservation, and our restaurant staff will assist you."
  },
  {
    input: "What is your policy on holding events or weddings at the hotel?",
    output: "We have event spaces available for weddings and other special occasions. Our events team can work with you to plan and host your event at our hotel."
  },
  {
    input: "Is there a fitness center available to guests?",
    output: "Yes, we have a fitness center equipped with exercise machines and free weights. It's available for guests who want to stay active during their stay."
  },
  {
    input: "What is the process for making a group reservation?",
    output: "For group reservations, please contact our group bookings team. They can assist you in reserving multiple rooms and provide group rates."
  },
  {
    input: "Are there any restaurants or cafes within walking distance?",
    output: "There are several dining options within walking distance of our hotel. We can provide you with a list of nearby restaurants and cafes."
  },
  {
    input: "Can I request a crib or baby cot for my infant?",
    output: "Yes, we provide cribs and baby cots for infants. Please let us know your request when making your reservation."
  },
  {
    input: "Is there a spa or wellness center at the hotel?",
    output: "Yes, we have a spa and wellness center where you can relax and enjoy various treatments. You can book spa services during your stay."
  },
  {
    input: "What is the policy on early check-in?",
    output: "Early check-in is subject to availability. You can request early check-in when making your reservation, and we'll do our best to accommodate your request."
  },
  {
    input: "Can I make reservations for a large group event?",
    output: "Yes, we can help you make reservations for large group events, such as meetings or conferences. Contact our events team for assistance."
  },
  {
    input: "What is the nearest medical facility in case of emergencies?",
    output: "The nearest medical facility is [mention the name and location]. In case of emergencies, please notify our front desk, and we'll assist you in getting medical attention."
  },
  {
    input: "Do you have a rooftop bar or lounge?",
    output: "Yes, we have a rooftop bar and lounge with stunning views. It's a great place to unwind and enjoy drinks with friends or fellow guests."
  },
  {
    input: "Are there any special offers for first-time guests?",
    output: "As a first-time guest, you may be eligible for special offers or discounts. Contact our reservations team to inquire about any current promotions."
  },
  {
    input: "What types of events or conferences are hosted at your hotel?",
    output: "Our hotel hosts a variety of events and conferences, including business meetings, weddings, seminars, and more. Contact our events team for information on upcoming events."
  },
  {
    input: "Is there a shuttle service to nearby attractions?",
    output: "We offer a shuttle service to some nearby attractions. Please check with our front desk for information on available shuttle routes and schedules."
  },
  {
    input: "What is your policy on lost and found items?",
    output: "If you have lost an item during your stay, please contact our lost and found department. We will make every effort to locate and return your lost belongings."
  },
  {
    input: "Do you provide in-room dining service?",
    output: "Yes, we offer in-room dining service. You can order from our room service menu and have your meals delivered to your room."
  },
  {
    input: "What is the process for reserving meeting rooms?",
    output: "To reserve meeting rooms at our hotel, please contact our events and meetings team. They can provide you with information on available meeting spaces and pricing."
  },
  {
    input: "Can I arrange a surprise for a special occasion?",
    output: "Absolutely! We can help you arrange surprises for special occasions, such as birthdays or anniversaries. Contact our concierge to discuss your plans."
  },
    {
      input:'In how many days I get the refund back in my account?',
      output:'You will get money back within 5 working days'
    }
    


    // Add more Q&A pairs as needed
  ];


export const classifier = new natural.BayesClassifier();

trainingData.forEach((data) => {
  classifier.addDocument(data.input, data.output);
});

classifier.train();
