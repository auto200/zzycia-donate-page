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
  Box,
  chakra,
  Image,
  // useClipboard,
} from "@chakra-ui/react";
import {
  defaultOptions,
  ENCODED_MESSAGE_MAX_LENGTH,
  HOTPAY_SECRET,
} from "../utils/constants";
//@ts-ignore
import sebekImg from "../images/sebek.png";

const IndexPage = () => {
  const [options, setOptions] = useState(defaultOptions);
  const [randomTexts] = useState(() =>
    Object.values(options).map(({ texts }) => sample(texts))
  );

  const [encodedMessage, setEncodedMessage] = useState("");
  const [activeOptionId, setActiveOptionId] = useState("");
  const [canSend, setCanSend] = useState(false);
  const [hotpayUrl, setHotpayUrl] = useState("");
  // const { onCopy } = useClipboard(hotpayUrl);

  const customAmmountInputRef = useRef(null);

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

  useEffect(() => {
    if (!activeOptionId) return;

    const url = new URL("https://platnosc.hotpay.pl");
    url.searchParams.append("SEKRET", HOTPAY_SECRET);
    url.searchParams.append("KWOTA", options[activeOptionId].ammout);
    url.searchParams.append("NAZWA_USLUGI", "Wsparcie");
    // url.searchParams.append("ADRES_WWW", "https://thank-you-url.pl");
    url.searchParams.append("ID_ZAMOWIENIA", encodedMessage);
    setHotpayUrl(url.href);
  }, [options.custom.ammout, activeOptionId, encodedMessage]);

  return (
    <>
      <SEO />
      <Center>
        <chakra.header m="5" mb="0" display="flex" alignItems="center">
          <Heading as="h1" fontSize="4xl">
            Wesprzyj Sebka
          </Heading>
          <Image src={sebekImg} w="40" />
        </chakra.header>
      </Center>
      <Center m="2" mt="0">
        <chakra.form
          w="100%"
          maxW="550px"
          onSubmit={e => {
            e.preventDefault();
            window.open(hotpayUrl, "_self");
          }}
        >
          <Stack>
            {Object.entries(options).map(([id, { ammout, currency }], i) => {
              const active = activeOptionId === id;
              return (
                <React.Fragment key={id}>
                  <HStack
                    onClick={() => {
                      setActiveOptionId(id);
                      if (id === "custom")
                        customAmmountInputRef.current.focus();
                    }}
                    _hover={{
                      cursor: "pointer",
                      bgColor: "gray.700",
                    }}
                    bgColor={active && "gray.600"}
                    rounded="lg"
                    role="group"
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
                          bgColor={active && "green.600"}
                          _groupHover={{ bgColor: "green.500" }}
                          _groupActive={{ bgColor: "green.400" }}
                        >
                          {currency}
                        </InputRightAddon>
                      </InputGroup>
                    ) : (
                      <Button
                        m="2"
                        bgColor={active ? "green.600" : "gray.700"}
                        _groupHover={{ bgColor: "green.500" }}
                        _groupActive={{ bgColor: "green.400" }}
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
            <Box pos="relative">
              <Textarea
                disabled={!canSend}
                placeholder="Twoja wiadomość (opcjonalnie)"
                value={decodeURIComponent(encodedMessage)}
                onChange={e => {
                  const message = encodeURIComponent(e.target.value);
                  if (message.length <= ENCODED_MESSAGE_MAX_LENGTH) {
                    setEncodedMessage(message);
                  }
                }}
              />
              {encodedMessage.length >= ENCODED_MESSAGE_MAX_LENGTH && (
                <Text pos="absolute" bottom="2" right="6" color="yellow.300">
                  Osiągnięto limit znaków
                </Text>
              )}
            </Box>
            <Button
              disabled={!canSend}
              type="submit"
              mb="10"
              h="16"
              bgColor={canSend && "green.500"}
              _hover={{ bgColor: canSend && "green.400" }}
              _active={{ bgColor: "green.300" }}
            >
              Dalej
            </Button>
            {/* <Text onClick={onCopy} _hover={{ cursor: "pointer" }}>
              {hotpayUrl}
            </Text> */}
          </Stack>
        </chakra.form>
      </Center>
    </>
  );
};

export default IndexPage;
