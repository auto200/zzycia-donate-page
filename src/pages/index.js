//@ts-check
import React, { useEffect, useRef, useState } from "react";
import SEO from "../components/seo";
import { sample } from "lodash";

import {
  Text,
  Stack,
  Input,
  InputGroup,
  HStack,
  Textarea,
  Button,
  Divider,
  Center,
  Heading,
  InputRightAddon,
} from "@chakra-ui/react";

const HOTPAY_SECRET =
  "UVhwS0FmMVQ4cy9KaWlaNjZkZGp0SndvRnRGUmRHWTYrTzEzalJHSHNkWT0%2C";

const IndexPage = () => {
  const [options, setOptions] = useState({
    1: {
      ammout: "10",
      currency: "zł",
      texts: ["na bułki", "na rybe"],
    },
    2: {
      ammout: "20",
      currency: "zł",
      texts: ["cel na 20 zl", "kolejny cel 20 zl", "cos za 2 dyszki"],
    },
    3: {
      ammout: "50",
      currency: "zł",
      texts: ["cel na 50 zl", "kolejny cel 50 zl", "cos za 5 dyszek"],
    },
    4: {
      ammout: "100",
      currency: "zł",
      texts: ["cel na 100 zl", "kolejny cel 100 zl", "cos za 1OO zł"],
    },
    custom: {
      ammout: "",
      currency: "zł",
      texts: ["tekst przy dowolnej kwocie", "dowolna kwota", "custom"],
    },
  });
  const [randomTexts] = useState(
    Object.values(options).map(({ texts }) => sample(texts))
  );

  const [message, setMessage] = useState("");
  const [activeOptionId, setActiveOptionId] = useState("");
  const [canSend, setCanSend] = useState(false);
  const [hotpayUrl, setHotpayUrl] = useState("");

  const customAmmountInputRef = useRef();

  useEffect(() => {
    if (!activeOptionId) {
      setCanSend(false);
      return;
    }
    if (activeOptionId !== "custom") {
      setCanSend(true);
      return;
    }
    if (Number(options.custom.ammout)) {
      setCanSend(true);
      return;
    }
    setCanSend(false);
  }, [activeOptionId, options.custom.ammout]);

  return (
    <>
      <SEO title="Home" />
      <Center>
        <Heading m="5" as="h1">
          Rzuć coś Sebkowi 🧔
        </Heading>
      </Center>
      <Center m="2">
        <Stack w="100%" maxW="550px">
          {Object.entries(options).map(([id, { ammout, currency }], i) => {
            return (
              <React.Fragment key={id}>
                <HStack
                  onClick={() => {
                    setActiveOptionId(id);
                    if (id === "custom") customAmmountInputRef.current.focus();
                  }}
                  _hover={{
                    cursor: "pointer",
                    bgColor: "gray.700",
                    "& button, & div div": { bgColor: "green.500" },
                  }}
                  bgColor={activeOptionId === id && "gray.600"}
                  rounded="lg"
                  p={2}
                >
                  {id === "custom" ? (
                    <InputGroup w="28">
                      <Input
                        ref={customAmmountInputRef}
                        type="number"
                        placeholder="..."
                        value={options.custom.ammout}
                        onChange={e =>
                          setOptions({
                            ...options,
                            custom: {
                              ...options.custom,
                              ammout: e.target.value,
                            },
                          })
                        }
                      />
                      <InputRightAddon
                        bgColor={activeOptionId === id && "green.600"}
                      >
                        {currency}
                      </InputRightAddon>
                    </InputGroup>
                  ) : (
                    <Button
                      m="2"
                      bgColor={activeOptionId === id ? "green.600" : "gray.700"}
                    >
                      {ammout}
                      {currency}
                    </Button>
                  )}
                  <Text>{randomTexts[i]}</Text>
                </HStack>
                <Divider />
              </React.Fragment>
            );
          })}
          <Textarea
            disabled={!canSend}
            maxLength={250}
            placeholder="Twoja wiadomość"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <Button
            disabled={!canSend}
            as="a"
            //remember to use encodeuricomponent!!
            // href={
            //   canSend
            //  hotpayUrl
            //     : null
            // }
            onClick={() => {
              const url = new URL("https://platnosc.hotpay.pl");
              url.searchParams.append("SEKRET", HOTPAY_SECRET);
              url.searchParams.append("KWOTA", options[activeOptionId].ammout);
              url.searchParams.append(
                "NAZWA_USLUGI",
                "tutaj bedzie nazwa uslugi"
              );
              url.searchParams.append("ADRES_WWW", "https://thank-you-url.pl");
              url.searchParams.append("ID_ZAMOWIENIA", message);
              setHotpayUrl(url.href);
            }}
          >
            Dalej
          </Button>
          <Text>{hotpayUrl}</Text>
        </Stack>
      </Center>
    </>
  );
};

export default IndexPage;
