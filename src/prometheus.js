const gcStats = require("prometheus-gc-stats");
const prometheus = require("prom-client");
const responseTime = require("response-time");
const UrlValueParser = require("url-value-parser");

const defaultOptions = {
  // excluded routes
  excludedRoutes: [],
  // buckets for response time from 0.05s to 13.5s
  durationBuckets: prometheus.exponentialBuckets(0.05, 1.75, 11),
  // from 50B to 3,9MB
  sizeBuckets: prometheus.exponentialBuckets(50, 5, 8)
};

export function middleware(userOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };
  const originalLabels = ["url", "method", "code"];
  const histogramLabels = ["method"];

  /**
   * request counter
   */
  const requestCount = new prometheus.Counter({
    name: "requests_total",
    help: "Counter for total requests received",
    labelNames: originalLabels
  });

  /**
   * request duration
   */
  const requestDuration = new prometheus.Counter({
    name: "request_duration_seconds",
    help: "Counter for total requests received",
    labelNames: originalLabels
  });

  /**
   * request duration histogram
   */
  const requestDurationHistogram = new prometheus.Histogram({
    name: "request_duration_histogram_seconds",
    help: "The Histogram for HTTP request latencies in seconds",
    labelNames: histogramLabels,
    buckets: options.durationBuckets
  });

  /**
   * response size
   */
  const responseSize = new prometheus.Counter({
    name: "response_size_bytes",
    help: "Counter for total response size",
    labelNames: originalLabels
  });

  /**
   * response size histogram
   */
  const responseSizeHistogram = new prometheus.Histogram({
    name: "response_size_histogram_bytes",
    help: "The Histogram for HTTP response size in bytes",
    labelNames: histogramLabels,
    buckets: options.sizeBuckets
  });

  /**
   * request size
   */
  const requestSize = new prometheus.Counter({
    name: "request_size_bytes",
    help: "Counter for total request size",
    labelNames: originalLabels
  });

  /**
   * request size histogram
   */
  const requestSizeHistogram = new prometheus.Histogram({
    name: "request_size_histogram_bytes",
    help: "The Histogram for HTTP request size in bytes",
    labelNames: histogramLabels,
    buckets: options.sizeBuckets
  });

  /**
   * Normalizes urls paths.
   *
   * This function replaces route params like ids, with a placeholder, so we can
   * set the metrics label, correctly. E.g., both routes
   *
   * @param {!string} originalUrl - url path.
   * @param {string} [placeholder='{val}'] - the placeholder that will replace id
   * like params in the url path.
   * @returns {string} a normalized path, withoud ids.
   */
  function normalizePath(originalUrl, placeholder = "{val}") {
    const urlParser = new UrlValueParser({ minHexLength: 4 });
    return urlParser.replacePathValues(originalUrl, placeholder);
  }

  /**
   * Get apprx request size.
   *
   * @param {!object} req - next js HTTP request object.
   * @returns {int} request size.
   */
  function computeApproximateRequestSize(req) {
    let { length } = req.originalUrl;

    length += req.method.length;
    length += req.protocol.length;

    if (typeof req.body !== "undefined") {
      length += req.body.length;
    }

    if (typeof req.headers !== "undefined") {
      Object.keys(req.headers).forEach(key => {
        length += key.length;
      });
      Object.values(req.headers).forEach(value => {
        length += value.length;
      });
    }

    return length;
  }

  /**
   * Record to the R(equest rate), E(error rate), and D(uration of requests).
   */
  const prometheusMiddleware = responseTime((req, res, time) => {
    const { route, method, originalUrl } = req;
    let url;
    if (typeof route === "undefined") {
      url = normalizePath(originalUrl);
    } else {
      url = route.path;
    }

    if (!options.excludedRoutes.includes(originalUrl)) {
      const code = res.statusCode;
      const labels = { url, method, code };
      const histLabels = { method };

      const reqLength = computeApproximateRequestSize(req);
      requestCount.inc(labels);
      requestSize.inc(labels, reqLength);
      requestSizeHistogram.observe(histLabels, reqLength);

      // normalizing to seconds
      requestDuration.inc(labels, time / 1000);
      requestDurationHistogram.observe(histLabels, time / 1000);

      const respLength = parseInt(res.get("Content-Length") || 0, 10);
      responseSize.inc(labels, respLength);
      responseSizeHistogram.observe(histLabels, respLength);
    }
  });

  prometheus.collectDefaultMetrics();
  const startGcStats = gcStats(prometheus.register);
  startGcStats();

  return prometheusMiddleware;
}

export function metricRoute(req, res) {
  res.set("Content-Type", prometheus.register.contentType);
  return res.end(prometheus.register.metrics());
}
